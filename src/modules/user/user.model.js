// ایمپورت کردن بسته mongoose و Schema از آن
const mongoose = require("mongoose");
const { Schema } = require("mongoose");

// تعریف اسکیمای OTP (کد تایید) که شامل کد و مدت زمان انقضا می‌شود
const OTPSchema = new Schema({
  // کد تایید که به صورت اختیاری در نظر گرفته شده است
  code: {
    type: String,
    required: false,
    default: undefined, // مقدار پیش‌فرض undefined
  },
  // زمان انقضای کد تایید (در ثانیه)
  expiresIn: {
    type: Number,
    default: 0, // مقدار پیش‌فرض صفر
    required: false,
  },
});

// تعریف اسکیمای User برای ذخیره اطلاعات کاربران
const UserSchema = new Schema(
  {
    // نام کامل کاربر که اختیاری است
    fullName: {
      type: String,
      required: false, // اختیاری است
    },
    // شماره موبایل کاربر که باید یکتا و الزامی باشد
    mobile: {
      type: String,
      unique: true, // اطمینان از یکتایی شماره موبایل
      required: true, // الزامی است
    },
    // اطلاعات مربوط به OTP که با اسکیمای OTPSchema تعریف شده
    otp: {
      type: OTPSchema,
    },
    // وضعیت تایید شماره موبایل، به طور پیش‌فرض false است
    verifiedMobile: {
      type: Boolean,
      required: true,
      default: false, // پیش‌فرض false
    },
    // توکن دسترسی که اختیاری است
    accessToken: String,
  },
  { timestamps: true } // اضافه کردن فیلدهای createdAt و updatedAt به صورت خودکار
);

// ایجاد مدل برای ذخیره اطلاعات کاربران در MongoDB
const UserModel = mongoose.model("user", UserSchema);

// صادرات مدل UserModel برای استفاده در دیگر قسمت‌های برنامه
module.exports = UserModel;
