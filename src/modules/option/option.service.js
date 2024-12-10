const autoBind = require("auto-bind"); // برای اطمینان از اینکه تمام متدهای کلاس به درستی متصل می‌شوند
const mongoose = require("mongoose"); // وارد کردن mongoose برای ارتباط با دیتابیس MongoDB
const { Schema, Types } = mongoose; // وارد کردن Schema و Types از mongoose برای تعریف اسکیمای مدل
const OptionModel = require("./option.model"); // وارد کردن مدل Option برای عملیات روی دیتابیس
const CategoryService = require("./../category/category.service"); // وارد کردن سرویس دسته‌بندی
const CategoryMessages = require("./../category/category.messages"); // وارد کردن پیام‌های مربوط به دسته‌بندی
const createHttpError = require("http-errors"); // برای تولید خطاهای HTTP
const { isValidObjectId } = require("mongoose"); // برای بررسی معتبر بودن ObjectId در MongoDB
const { OptionMessages } = require("./option.messages"); // وارد کردن پیام‌های مربوط به گزینه‌ها
const { default: slugify } = require("slugify"); // برای تبدیل رشته‌ها به slug
const { isTrue, isFalse } = require("../../common/utils/functions"); // توابع کمکی برای بررسی وضعیت‌های خاص

class OptionService {
  #model; // مدل برای تعامل با دیتابیس
  #categoryService; // سرویس دسته‌بندی برای انجام عملیات روی دسته‌بندی‌ها

  constructor() {
    autoBind(this); // متصل کردن متدها به شیء برای استفاده بدون نیاز به bind
    this.#model = OptionModel; // تنظیم مدل Option
    this.#categoryService = CategoryService; // تنظیم سرویس دسته‌بندی
  }

  // متد برای یافتن همه گزینه‌ها
  async find() {
    const options = await this.#model
      .find({}, { __v: 0 }, { sort: { _id: -1 } }) // جستجو بدون __v و به ترتیب نزولی _id
      .populate({ path: "category", select: { name: 1, slug: 1 } }); // پر کردن اطلاعات دسته‌بندی
    return options;
  }

  // متد برای یافتن گزینه بر اساس شناسه
  async findById(id) {
    return await this.checkExistById(id); // بررسی وجود گزینه با استفاده از شناسه
  }

  // متد برای حذف گزینه بر اساس شناسه
  async removeById(id) {
    await this.checkExistById(id); // بررسی وجود گزینه قبل از حذف
    return await this.#model.deleteOne({ _id: id }); // حذف گزینه
  }

  // متد برای یافتن گزینه‌ها بر اساس شناسه دسته‌بندی
  async findByCategoryId(category) {
    return await this.#model
      .find({ category }, { __v: 0 }) // جستجو بر اساس شناسه دسته‌بندی
      .populate({ path: "category", select: { name: 1, slug: 1 } }); // پر کردن اطلاعات دسته‌بندی
  }

  // متد برای یافتن گزینه‌ها بر اساس slug دسته‌بندی
  async findByCategorySlug(slug) {
    const options = await this.#model.aggregate([
      // استفاده از aggregate برای ترکیب داده‌ها
      {
        $lookup: {
          from: "categories", // جستجو در مدل "categories"
          localField: "category", // استفاده از فیلد category در مدل Option
          foreignField: "_id", // مقایسه با فیلد _id در مدل Category
          as: "category", // داده‌های دسته‌بندی در فیلد جدید category قرار می‌گیرد
        },
      },
      {
        $unwind: "$category", // ترکیب داده‌های category
      },
      {
        $addFields: {
          categorySlug: "$category.slug", // اضافه کردن slug دسته‌بندی
          categoryName: "$category.name", // اضافه کردن نام دسته‌بندی
          categoryIcon: "$category.icon", // اضافه کردن آیکون دسته‌بندی
        },
      },
      {
        $project: {
          category: 0, // فیلتر کردن داده‌های دسته‌بندی
          __v: 0, // حذف فیلد __v
        },
      },
      {
        $match: {
          categorySlug: slug, // مطابقت با slug مورد نظر
        },
      },
    ]);
    return options;
  }

  // متد برای ایجاد یک گزینه جدید
  async create(optionDto) {
    const category = await this.#categoryService.checkExistById(
      optionDto.category
    ); // بررسی وجود دسته‌بندی
    optionDto.category = category._id; // تنظیم شناسه دسته‌بندی
    optionDto.key = slugify(optionDto.key, {
      // تبدیل کلید به slug
      trim: true,
      replacement: "_",
      lower: true,
    });
    await this.alreadyExistByCategoryAndKey(optionDto.key, optionDto.category); // بررسی وجود گزینه مشابه
    if (optionDto?.enum && typeof optionDto.enum === "string") {
      optionDto.enum = optionDto.enum.split(","); // تبدیل رشته enum به آرایه
    } else if (!Array.isArray(optionDto.enum)) optionDto.enum = []; // اگر آرایه نباشد، آن را به آرایه خالی تبدیل می‌کند
    if (isTrue(optionDto?.required)) optionDto.required = true; // بررسی و تنظیم مقدار required
    if (isFalse(optionDto?.required)) optionDto.required = false; // بررسی و تنظیم مقدار required
    const option = await this.#model.create(optionDto); // ایجاد گزینه جدید
    return option;
  }

  // متد برای به‌روزرسانی یک گزینه
  async update(id, optionDto) {
    const existOption = await this.checkExistById(id); // بررسی وجود گزینه قبل از به‌روزرسانی
    if (optionDto.category && isValidObjectId(optionDto.category)) {
      const category = await this.#categoryService.checkExistById(
        optionDto.category
      ); // بررسی وجود دسته‌بندی جدید
      optionDto.category = category._id; // تنظیم شناسه دسته‌بندی
    } else {
      delete optionDto.category; // حذف دسته‌بندی اگر وجود نداشت
    }
    if (optionDto.slug) {
      optionDto.key = slugify(optionDto.key, {
        // تبدیل کلید به slug
        trim: true,
        replacement: "_",
        lower: true,
      });
      let categoryId = existOption.category;
      await this.alreadyExistByCategoryAndKey(optionDto.key, categoryId); // بررسی وجود گزینه مشابه
    }
    if (optionDto?.enum && typeof optionDto.enum !== "string") {
      optionDto.enum = optionDto.enum.split(","); // تبدیل رشته enum به آرایه
    } else if (!Array.isArray(optionDto.enum)) delete optionDto.enum; // حذف enum در صورت نیاز
    if (isTrue(optionDto?.required))
      optionDto.required = true; // بررسی و تنظیم required
    else if (isFalse(optionDto?.required))
      optionDto.required = false; // بررسی و تنظیم required
    else delete optionDto.required; // حذف required در صورت نیاز
    return await this.#model.updateOne(
      { _id: id },
      {
        $set: {
          title: optionDto.title,
          key: optionDto.key,
          enum: optionDto.enum,
          guide: optionDto.guide,
          category: optionDto.category,
          type: optionDto.type,
          required: optionDto.required,
        },
      }
    );
  }

  // متد برای بررسی وجود گزینه با شناسه
  async checkExistById(id) {
    const option = await this.#model.findById(id); // جستجو در مدل بر اساس شناسه
    if (!option) throw new createHttpError.NotFound(CategoryMessages.NotFound); // اگر گزینه وجود نداشت، خطا می‌دهد
    return option;
  }

  // متد برای بررسی وجود گزینه مشابه بر اساس دسته‌بندی و کلید
  async alreadyExistByCategoryAndKey(key, category) {
    const isExistOption = await this.#model.findOne({ key, category }); // جستجو در مدل بر اساس کلید و دسته‌بندی
    if (isExistOption)
      throw new createHttpError.Conflict(OptionMessages.AlreadyExist); // در صورت وجود، خطا می‌دهد
    return null;
  }

  async checkExistBySlug(slug) {} // متدهای خالی برای بررسی وجود گزینه بر اساس slug
  async alreadyExistBySlug(slug) {}
}

module.exports = new OptionService(); // صادر کردن شیء OptionService
