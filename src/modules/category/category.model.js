// وارد کردن mongoose برای ارتباط با پایگاه داده MongoDB
const mongoose = require("mongoose");
// وارد کردن Schema از mongoose برای تعریف مدل
const { Schema } = require("mongoose");

// تعریف اسکیمای دسته‌بندی با استفاده از mongoose.Schema
const CategorySchema = new Schema(
  {
    // نام دسته‌بندی
    name: {
      type: String, // نوع داده رشته
      required: true, // اجباری بودن فیلد
    },
    // شناسه یکتا یا slug دسته‌بندی
    slug: {
      type: String, // نوع داده رشته
      required: true, // اجباری بودن فیلد
      index: true, // ایجاد ایندکس برای این فیلد
    },
    // آیکن دسته‌بندی
    icon: {
      type: String, // نوع داده رشته
      required: true, // اجباری بودن فیلد
    },
    // دسته‌بندی والد (اختیاری)
    parent: {
      type: Schema.Types.ObjectId, // نوع داده ObjectId برای ارجاع به دسته‌بندی دیگر
      ref: "Category", // ارجاع به مدل دسته‌بندی
      required: false, // اجباری نبودن فیلد
    },
    // والدین دسته‌بندی‌ها (اختیاری)
    parents: {
      type: [Schema.Types.ObjectId], // آرایه‌ای از نوع ObjectId
      ref: "Category", // ارجاع به مدل دسته‌بندی
      required: false, // اجباری نبودن فیلد
      default: [], // مقدار پیش‌فرض آرایه خالی
    },
  },
  // تنظیمات اضافی اسکیمای دسته‌بندی
  { versionKey: false, id: false, toJSON: { virtuals: true } }
);

// تعریف یک ویژگی مجازی "children" برای دریافت زیرمجموعه‌های یک دسته‌بندی
CategorySchema.virtual("children", {
  ref: "Category", // ارجاع به مدل دسته‌بندی
  localField: "_id", // فیلد محلی که به فیلد خارجی ارجاع داده می‌شود
  foreignField: "parent", // فیلد خارجی که با فیلد محلی مطابقت دارد
});

// اجرای عملیات پیش‌فرض هنگام پیدا کردن دسته‌بندی‌ها
CategorySchema.pre(/^find/, function (next) {
  // استفاده از populate برای پر کردن اطلاعات "children" در هر دسته‌بندی
  this.populate({
    path: "children", // فیلدی که باید پر شود
    select: "-__v -passwordChangedAt", // فیلدهایی که نباید در نتایج نهایی نمایش داده شوند
  });
  next(); // ادامه اجرای عملیات بعد از پر کردن
});

// ایجاد مدل دسته‌بندی با استفاده از اسکیمای تعریف‌شده
const CategoryModel = mongoose.model("Category", CategorySchema);

// صادر کردن مدل برای استفاده در سایر بخش‌ها
module.exports = CategoryModel;
