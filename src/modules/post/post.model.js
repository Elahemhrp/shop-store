// وارد کردن کتابخانه mongoose برای اتصال به دیتابیس MongoDB
const mongoose = require("mongoose");
// وارد کردن شیء Schema از mongoose برای تعریف ساختار مدل
const { Schema } = require("mongoose");

// تعریف اسکیمای پست که نحوه ذخیره‌سازی داده‌ها در دیتابیس را تعیین می‌کند
const PostSchema = new Schema(
  {
    // عنوان پست که یک فیلد الزامی از نوع رشته است
    title: {
      type: String,
      required: true,
    },

    // محتوای پست که یک فیلد الزامی از نوع رشته است
    content: {
      type: String,
      required: true,
    },

    // مقدار پست (مثلاً قیمت) که یک فیلد الزامی از نوع عدد است و پیش‌فرض 0 دارد
    amount: {
      type: Number,
      required: true,
      default: 0,
    },

    // شناسه کاربری که پست متعلق به آن است، از نوع ObjectId و الزامی است
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },

    // شناسه دسته‌بندی پست که یک فیلد الزامی از نوع ObjectId است و به مدل "Category" اشاره دارد
    category: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Category", // ارجاع به مدل Category
    },

    // استان پست (اختیاری)
    province: {
      type: String,
      required: false,
    },

    // آدرس پست (اختیاری)
    address: {
      type: String,
      required: false,
    },

    // شهر پست (اختیاری)
    city: {
      type: String,
      required: false,
    },

    // منطقه پست (اختیاری)
    district: {
      type: String,
      required: false,
    },

    // مختصات جغرافیایی پست که یک آرایه از اعداد (عرض جغرافیایی و طول جغرافیایی) است
    coordinate: {
      type: [Number],
      required: true,
    },

    // تصاویر مرتبط با پست که یک آرایه از رشته‌ها (مسیر فایل‌ها) است
    images: {
      type: [String],
      required: true,
      default: [], // پیش‌فرض آرایه‌ای خالی است
    },

    // گزینه‌های اضافی مربوط به پست که می‌تواند شامل هر نوع داده‌ای باشد
    options: {
      type: Object,
      default: {}, // پیش‌فرض یک شیء خالی است
    },
  },
  { timestamps: true } // ایجاد فیلدهای createdAt و updatedAt به طور خودکار
);

// ایجاد مدل پست با استفاده از اسکیمای تعریف‌شده
const PostModel = mongoose.model("Post", PostSchema);

// صادر کردن مدل برای استفاده در سایر بخش‌های برنامه
module.exports = PostModel;
