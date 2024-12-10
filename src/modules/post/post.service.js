const autoBind = require("auto-bind");
const mongoose = require("mongoose");
const { Schema, Types } = mongoose;
const PostModel = require("./post.model");
const OptionModel = require("../option/option.model");
const CategoryModel = require("../category/category.model");
const { isValidObjectId } = require("mongoose");
const { PostMessages } = require("./post.messages");
const createHttpError = require("http-errors");

class PostService {
  #model; // مدل پست
  #optionModel; // مدل گزینه‌ها
  #categoryModel; // مدل دسته‌بندی‌ها
  constructor() {
    autoBind(this); // برای خودکار بایند کردن متدهای کلاس به اینستنس
    this.#model = PostModel; // مدل پست را تنظیم می‌کند
    this.#optionModel = OptionModel; // مدل گزینه‌ها را تنظیم می‌کند
    this.#categoryModel = CategoryModel; // مدل دسته‌بندی‌ها را تنظیم می‌کند
  }

  // دریافت گزینه‌های یک دسته‌بندی خاص
  async getCategoryOptions(categoryId) {
    const options = await this.#optionModel.find({ category: categoryId }); // جستجو برای گزینه‌های دسته‌بندی
    return options;
  }

  // ایجاد یک پست جدید
  async create(dto) {
    return await this.#model.create(dto); // ایجاد پست جدید در مدل
  }

  // جستجو برای پست‌ها بر اساس شناسه کاربر
  async find(userId) {
    if (userId && isValidObjectId(userId))
      return await this.#model.find({ userId }); // جستجو پست‌ها با شناسه کاربر
    throw new createHttpError.BadRequest(PostMessages.RequestNotValid); // اگر شناسه معتبر نباشد، خطا می‌دهد
  }

  // جستجو برای تمام پست‌ها با گزینه‌های دسته‌بندی و جستجو
  async findAll(options) {
    let { category, search } = options; // گرفتن گزینه‌های دسته‌بندی و جستجو از پارامتر
    const query = {}; // ایجاد کوئری برای جستجو
    if (category) {
      console.log(this.#categoryModel); // نمایش مدل دسته‌بندی در کنسول
      const result = await this.#categoryModel.findOne({ slug: category }); // پیدا کردن دسته‌بندی بر اساس slug
      let categories = await this.#categoryModel.find(
        {
          parents: result._id, // یافتن دسته‌بندی‌های فرزند
        },
        { _id: 1 }
      );
      categories = categories.map((item) => item._id); // استخراج شناسه‌های دسته‌بندی‌های فرزند
      if (result) {
        query["category"] = {
          $in: [result._id, ...categories], // افزودن دسته‌بندی اصلی و فرزند به کوئری
        };
      } else {
        return []; // اگر دسته‌بندی یافت نشد، آرایه خالی برمی‌گرداند
      }
    }
    if (search) {
      search = new RegExp(search, "ig"); // جستجوی حساس به بزرگ و کوچک بودن حروف
      query["$or"] = [{ title: search }, { description: search }]; // جستجو در عنوان و توضیحات
    }

    const posts = await this.#model.find(query, {}, { sort: { _id: -1 } }); // پیدا کردن پست‌ها با ترتیب نزولی
    return posts;
  }

  // بررسی وجود پست بر اساس شناسه
  async checkExist(postId) {
    if (!postId || !isValidObjectId(postId))
      throw new createHttpError.BadRequest(PostMessages.RequestNotValid); // اگر شناسه معتبر نباشد، خطا می‌دهد
    const [post] = await this.#model.aggregate([
      { $match: { _id: new Types.ObjectId(postId) } }, // جستجو برای پست با شناسه داده شده
      {
        $lookup: {
          from: "users", // ارتباط با مدل کاربران برای نمایش اطلاعات کاربر
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user", // تبدیل آرایه کاربر به یک شیء
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          userMobile: "$user.mobile", // اضافه کردن شماره موبایل کاربر به پست
        },
      },
      {
        $project: {
          user: 0, // حذف اطلاعات کامل کاربر از نمایش
        },
      },
    ]);
    if (!post) throw new createHttpError.NotFound(PostMessages.NotFound); // اگر پست پیدا نشد، خطا می‌دهد
    return post;
  }

  // حذف پست بر اساس شناسه
  async remove(postId) {
    await this.checkExist(postId); // بررسی وجود پست قبل از حذف
    await this.#model.deleteOne({ _id: postId }); // حذف پست با شناسه داده شده
  }
}

module.exports = new PostService(); // صادر کردن نمونه از PostService
