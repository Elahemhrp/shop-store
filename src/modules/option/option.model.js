const mongoose = require("mongoose");
const { Schema } = require("mongoose");

// تعریف اسکیمای Option برای ذخیره‌سازی در دیتابیس MongoDB
const OptionSchema = new Schema({
  title: {
    type: String, // نوع داده String برای عنوان
    required: true, // این فیلد الزامی است
  },
  key: {
    type: String, // نوع داده String برای کلید
    required: true, // این فیلد الزامی است
  },
  type: {
    type: String, // نوع داده String برای نوع گزینه
    enum: ["number", "string", "boolean", "array"], // فقط یکی از این مقادیر می‌تواند انتخاب شود
  },
  enum: {
    type: Array, // نوع داده Array برای ذخیره کردن مقادیر مشابه
    default: [], // مقدار پیش‌فرض یک آرایه خالی است
  },
  guide: {
    type: String, // نوع داده String برای راهنمایی
    required: false, // این فیلد اختیاری است
  },
  category: {
    type: Schema.Types.ObjectId, // نوع داده ObjectId برای ارتباط با مدل دیگر (Category)
    required: true, // این فیلد الزامی است
    ref: "Category", // اشاره به مدل Category برای ارتباط (populate)
  },
  required: {
    type: Boolean, // نوع داده Boolean برای نشان دادن الزامی بودن گزینه
    required: true, // این فیلد الزامی است
    default: false, // مقدار پیش‌فرض false است (یعنی اختیاری)
  },
});

// ایجاد مدل Option با استفاده از اسکیمای OptionSchema
const OptionModel = mongoose.model("Option", OptionSchema);

// صادر کردن مدل برای استفاده در بخش‌های دیگر برنامه
module.exports = OptionModel;
