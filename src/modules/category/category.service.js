// وارد کردن پکیج auto-bind برای اطمینان از متصل شدن خودکار متدها به کلاس
const autoBind = require("auto-bind");
// وارد کردن mongoose برای تعامل با پایگاه داده MongoDB
const mongoose = require("mongoose");
// وارد کردن Schema و Types از mongoose برای تعریف ساختار داده‌ها
const { Schema, Types } = mongoose;
// وارد کردن مدل Category برای انجام عملیات روی داده‌های دسته‌بندی
const createHttpError = require("http-errors");
const CategoryModel = require("./category.model");
// وارد کردن مدل Option برای انجام عملیات روی گزینه‌ها
const OptionModel = require("../option/option.model");
// وارد کردن تابع isValidObjectId برای بررسی اعتبار شناسه‌های MongoDB
const { isValidObjectId } = require("mongoose");
// وارد کردن پیام‌های خطا و موفقیت مرتبط با دسته‌بندی‌ها
const { CategoryMessages } = require("./category.messages");
// وارد کردن پکیج slugify برای تولید اسلاگ (شناسه URL-friendly) از نام دسته‌بندی
const { default: slugify } = require("slugify");

class CategoryService {
  #model; // مدل مربوط به دسته‌بندی
  #optionModel; // مدل مربوط به گزینه‌ها

  constructor() {
    autoBind(this); // متصل کردن متدها به این کلاس به‌طور خودکار
    this.#model = CategoryModel; // اختصاص مدل Category به #model
    this.#optionModel = OptionModel; // اختصاص مدل Option به #optionModel
  }

  // متد برای یافتن دسته‌بندی‌هایی که والد ندارند
  async find() {
    // انجام عملیات جستجو برای یافتن دسته‌بندی‌ها با شرط نبود والد
    return await this.#model.find({ parent: { $exists: false } }).populate();
  }

  // متد برای حذف دسته‌بندی بر اساس شناسه
  async remove(id) {
    const category = await this.checkExistById(id); // بررسی وجود دسته‌بندی
    // حذف گزینه‌ها مرتبط با این دسته‌بندی
    await this.#optionModel.deleteMany({ category: id }).then(async () => {
      // حذف خود دسته‌بندی پس از حذف گزینه‌ها
      await this.#model.deleteOne({ _id: id });
    });
    return true;
  }

  // متد برای ایجاد دسته‌بندی جدید
  async create(categoryDto) {
    // اگر دسته‌بندی والد وجود دارد، ابتدا آن را پیدا کرده و parents را به‌روزرسانی می‌کنیم
    if (categoryDto?.parent && isValidObjectId(categoryDto.parent)) {
      const existCategory = await this.checkExistById(categoryDto.parent);
      categoryDto.parent = existCategory._id;
      categoryDto.parents = [
        ...new Set(
          [existCategory._id.toString()]
            .concat(existCategory.parents.map((id) => id.toString()))
            .map((id) => new Types.ObjectId(id))
        ),
      ];
    }

    // بررسی و تولید اسلاگ برای دسته‌بندی
    if (categoryDto?.slug) {
      categoryDto.slug = slugify(categoryDto.slug);
      await this.alreadyExistBySlug(categoryDto.slug); // بررسی اینکه اسلاگ قبلاً وجود نداشته باشد
    } else {
      categoryDto.slug = slugify(categoryDto.name); // تولید اسلاگ از نام دسته‌بندی
    }

    // ایجاد دسته‌بندی جدید در پایگاه داده
    const category = await this.#model.create(categoryDto);
    return category;
  }

  // متد برای بررسی وجود دسته‌بندی با شناسه خاص
  async checkExistById(id) {
    const category = await this.#model.findById(id); // جستجو بر اساس شناسه
    if (!category)
      throw new createHttpError.NotFound(CategoryMessages.NotFound); // پرتاب خطا در صورت عدم وجود دسته‌بندی
    return category;
  }

  // متد برای بررسی وجود دسته‌بندی با اسلاگ خاص
  async checkExistBySlug(slug) {
    const category = await this.#model.findOne({ slug }); // جستجو بر اساس اسلاگ
    if (!category)
      throw new createHttpError.NotFound(CategoryMessages.NotFound); // پرتاب خطا در صورت عدم وجود دسته‌بندی
    return category;
  }

  // متد برای بررسی اینکه آیا اسلاگ مورد نظر قبلاً استفاده شده است
  async alreadyExistBySlug(slug) {
    const category = await this.#model.findOne({ slug }); // جستجو بر اساس اسلاگ
    if (category)
      throw new createHttpError.Conflict(CategoryMessages.AlreadyExist); // پرتاب خطا در صورت وجود اسلاگ تکراری
    return null;
  }
}

module.exports = new CategoryService(); // صادر کردن نمونه‌ای از CategoryService برای استفاده در سایر بخش‌ها
