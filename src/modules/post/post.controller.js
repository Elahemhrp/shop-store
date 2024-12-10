const autoBind = require("auto-bind"); // برای اتصال خودکار متدهای کلاس به نمونه‌ها
const utf8 = require("utf8"); // برای رمزگشایی رشته‌ها از فرمت UTF-8
const path = require("path"); // برای کار با مسیرهای فایل‌ها
const postService = require("./post.service"); // وارد کردن سرویس مربوط به پست‌ها
const { PostMessages } = require("./post.messages"); // وارد کردن پیام‌های مربوط به پست‌ها
const HttpCodes = require(`http-codes`); // برای استفاده از کدهای وضعیت HTTP
const CategoryModel = require("../category/category.model"); // وارد کردن مدل دسته‌بندی‌ها
const mongoose = require("mongoose"); // برای تعامل با MongoDB
const { Schema, Types } = mongoose; // وارد کردن Schema و Types برای مدل‌های Mongoose
const { default: axios } = require("axios"); // برای ارسال درخواست‌های HTTP
const createHttpError = require("http-errors"); // برای تولید خطاهای HTTP
const { getAddressDetail } = require("../../common/utils/http"); // برای دریافت جزئیات آدرس
const { removePropertiesInObject } = require("../../common/utils/functions"); // برای حذف خاصیت‌ها از اشیاء

class PostController {
  #service; // تعریف سرویس برای پست‌ها
  success_message; // متغیری برای ذخیره پیام موفقیت

  constructor() {
    autoBind(this); // اتصال خودکار متدهای کلاس به نمونه‌ها
    this.#service = postService; // تنظیم سرویس پست‌ها
  }

  // متد برای ایجاد صفحه پست جدید بر اساس دسته‌بندی
  async createPostPage(req, res, next) {
    try {
      let { slug } = req.query; // گرفتن slug از پارامترهای درخواست
      let match = { parent: null }; // مقدار پیش‌فرض برای match
      let showBack = false; // تعیین اینکه آیا دکمه بازگشت نمایش داده شود یا نه
      let options, category; // متغیرهایی برای ذخیره گزینه‌ها و دسته‌بندی
      if (slug) {
        slug = slug.trim(); // حذف فضاهای اضافی از slug
        category = await CategoryModel.findOne({ slug }); // جستجو در مدل دسته‌بندی بر اساس slug

        if (!category)
          throw new createHttpError.NotFound(PostMessages.NotFound); // در صورتی که دسته‌بندی پیدا نشود، خطا می‌دهد

        options = await this.#service.getCategoryOptions(category._id); // دریافت گزینه‌های مربوط به دسته‌بندی

        if (options.length === 0) options = null; // اگر گزینه‌ای موجود نباشد، آن را null قرار می‌دهد
        showBack = true; // دکمه بازگشت را نمایش می‌دهد
        match = { parents: category._id }; // تنظیم match برای جستجو در دسته‌بندی‌های فرزند
      }

      const categories = await CategoryModel.aggregate([{ $match: match }]); // جستجو در دسته‌بندی‌ها با استفاده از aggregation
      res.json({
        categories: categories, // ارسال دسته‌بندی‌ها به کلاینت
        showBack: showBack, // ارسال وضعیت نمایش دکمه بازگشت
        options, // ارسال گزینه‌ها
        category: category?._id.toString(), // ارسال شناسه دسته‌بندی
      });
    } catch (error) {
      next(error); // ارسال خطا به middleware بعدی
    }
  }

  // متد برای ایجاد پست جدید
  async create(req, res, next) {
    try {
      const userId = req.user._id; // دریافت شناسه کاربر از اطلاعات احراز هویت
      const images = req.files?.map(
        (image) => path.join("upload", image.filename) // استخراج مسیر تصاویر بارگذاری‌شده
      );

      const {
        title_post: title,
        description: content,
        lat,
        lng,
        category,
        amount,
      } = req.body; // استخراج اطلاعات از بدنه درخواست

      // دریافت جزئیات آدرس بر اساس مختصات جغرافیایی
      const { province, city, district, address } = await getAddressDetail(
        lat,
        lng
      );
      const options = removePropertiesInObject(req.body, [
        "title_post",
        "description",
        "lat",
        "lng",
        "category",
        "images",
        "amount",
      ]); // حذف برخی ویژگی‌ها از شیء درخواست
      for (let key in options) {
        let value = options[key];
        delete options[key];
        key = utf8.decode(key); // رمزگشایی کلیدها از UTF-8
        options[key] = value;
      }

      // ایجاد پست جدید
      const post = await this.#service.create({
        userId,
        amount,
        images,
        title,
        content,
        coordinate: [lat, lng],
        category: new Types.ObjectId(category),
        options,
        address,
        province,
        city,
        district,
      });
      this.success_message = PostMessages.Created; // تنظیم پیام موفقیت
      res.json({ post }); // ارسال پاسخ به کلاینت
    } catch (error) {
      next(error); // ارسال خطا به middleware بعدی
    }
  }

  // متد برای دریافت پست‌های کاربر
  async findMyPosts(req, res, next) {
    try {
      const userId = req.user._id; // دریافت شناسه کاربر
      const posts = await this.#service.find(userId); // دریافت پست‌ها از سرویس
      res.json({
        posts, // ارسال پست‌ها
        count: posts.length, // ارسال تعداد پست‌ها
        success_message: this.success_message, // ارسال پیام موفقیت
      });
      this.success_message = null; // صفر کردن پیام موفقیت پس از ارسال
    } catch (error) {
      next(error); // ارسال خطا به middleware بعدی
    }
  }

  // متد برای حذف پست بر اساس شناسه
  async remove(req, res, next) {
    try {
      const { id } = req.params; // دریافت شناسه از پارامترهای URL
      await this.#service.remove(id); // حذف پست از سرویس
      this.success_message = PostMessages.Deleted; // تنظیم پیام موفقیت
      res.redirect("/post/my"); // هدایت به صفحه پست‌های کاربر
    } catch (error) {
      next(error); // ارسال خطا به middleware بعدی
    }
  }

  // متد برای نمایش جزئیات یک پست
  async showPost(req, res, next) {
    try {
      const { id } = req.params; // دریافت شناسه پست از پارامترهای URL
      const post = await this.#service.checkExist(id); // بررسی وجود پست
      res.locals.layout = "./layouts/website/main.ejs"; // تنظیم قالب صفحه
      res.json({ post }); // ارسال جزئیات پست به کلاینت
    } catch (error) {
      next(error); // ارسال خطا به middleware بعدی
    }
  }

  // متد برای دریافت لیست پست‌ها
  async postsList(req, res, next) {
    try {
      const query = req.query; // دریافت پارامترهای جستجو از query string
      const posts = await this.#service.findAll(query); // جستجو در پست‌ها با استفاده از پارامترهای query
      res.locals.layout = "./layouts/website/main.ejs"; // تنظیم قالب صفحه
      res.json({ posts }); // ارسال پست‌ها به کلاینت
    } catch (error) {
      next(error); // ارسال خطا به middleware بعدی
    }
  }
}

module.exports = new PostController(); // صادر کردن شیء کنترلر پست
