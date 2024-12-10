const autoBind = require(`auto-bind`); // کتابخانه‌ای برای اتصال خودکار متدهای کلاس به نمونه جاری
const UserModel = require(`../user/user.model`); // مدل کاربر برای تعامل با دیتابیس
const AuthMessages = require(`./auth.messages`); // پیام‌های ثابت مرتبط با احراز هویت
const createHttpError = require("http-errors"); // ابزار ساخت خطاهای HTTP
const { randomInt } = require(`crypto`); // ابزار تولید اعداد تصادفی (برای ایجاد کد OTP)
const jwt = require(`jsonwebtoken`); // ابزار ایجاد و مدیریت توکن‌های JWT

class AuthService {
  #model; // فیلد خصوصی برای نگهداری مدل کاربر

  constructor() {
    autoBind(this); // اتصال خودکار متدها به نمونه جاری
    this.#model = UserModel; // مقداردهی فیلد خصوصی با مدل کاربر
  }

  // متد برای ارسال کد OTP به شماره موبایل
  async sendOTP(mobile) {
    // بررسی وجود کاربر با شماره موبایل
    const user = await this.checkExistByMobile(mobile);
    const now = new Date().getTime(); // زمان فعلی
    const otp = {
      code: randomInt(10000, 99999), // تولید کد OTP تصادفی
      expiresIn: now + 1000 * 60 * 30, // تعیین زمان انقضا (۳۰ دقیقه)
    };

    // اگر کاربر وجود نداشت، کاربر جدید ایجاد می‌شود
    if (!user) {
      const newUser = await this.#model.create({
        mobile,
        otp,
      });
      return newUser;
    }

    // اگر کد OTP قبلی هنوز معتبر باشد، خطا ارسال می‌شود
    if (user.otp && user.otp.expiresIn > now)
      throw new createHttpError.BadRequest(AuthMessages.OtpCodeNotEpired);

    // ذخیره کد OTP جدید در دیتابیس
    (user.otp = otp), await user.save();
    return user;
  }

  // متد برای بررسی کد OTP وارد شده توسط کاربر
  async checkOTP(mobile, code) {
    const user = await this.checkExistByMobile(mobile); // بررسی وجود کاربر
    const now = new Date().getTime(); // زمان فعلی

    // بررسی انقضای کد OTP
    if (user?.otp?.expiresIn < now)
      throw new createHttpError.Unauthorized(AuthMessages.OtpCodeEpired);

    // بررسی صحیح بودن کد OTP
    if (user?.otp?.code !== code)
      throw new createHttpError.Unauthorized(AuthMessages.tpCodeIsIncorrect);

    // تایید شماره موبایل در صورت نیاز
    if (!user.verifiedMobile) {
      user.verifiedMobile = true;
    }

    // ایجاد توکن JWT
    const accessToken = this.signToken({ mobile, id: user._id });

    // ذخیره تغییرات در دیتابیس
    user.save();

    return accessToken; // بازگرداندن توکن به کاربر
  }

  // متد برای خروج کاربر (فعلاً خالی است)
  async logout() {}

  // متد برای بررسی وجود کاربر با شماره موبایل
  async checkExistByMobile(mobile) {
    const user = this.#model.findOne({ mobile }); // جستجوی کاربر در دیتابیس
    if (!user) throw new createHttpError.NotFound(AuthMessages.NotFound); // ارسال خطا در صورت عدم وجود کاربر
    return user; // بازگرداندن اطلاعات کاربر
  }

  // متد برای ایجاد توکن JWT
  signToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "1y" }); // ایجاد توکن با اعتبار یک سال
  }
}

module.exports = new AuthService(); // صادرات نمونه‌ای از سرویس احراز هویت
