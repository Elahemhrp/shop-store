const authService = require(`./auth.service`); // وارد کردن سرویس احراز هویت
const { AuthMessages } = require(`./auth.messages`); // وارد کردن پیام‌های از پیش تعریف شده مربوط به احراز هویت
const autoBind = require(`auto-bind`); // ابزار برای اتصال خودکار متدها به اینستنس کلاس
const NodeEnv = require("../../common/constants/env.enum"); // ثابت‌های مربوط به محیط اجرایی
const CookieNames = require("../../common/constants/cookie.enum"); // ثابت‌های مربوط به نام کوکی‌ها

class AuthController {
  #service; // فیلد خصوصی برای سرویس احراز هویت

  constructor() {
    autoBind(this); // اتصال خودکار متدهای کلاس به اینستنس جاری
    this.#service = authService; // اختصاص سرویس احراز هویت به فیلد خصوصی
  }

  /**
   * ارسال کد OTP به شماره موبایل ارائه شده.
   * @param {Object} req - شیء درخواست شامل شماره موبایل در بدنه درخواست.
   * @param {Object} res - شیء پاسخ برای ارسال وضعیت و پیام.
   * @param {Function} next - تابع میدل‌ور بعدی در صورت بروز خطا.
   */
  async sendOTP(req, res, next) {
    try {
      const { mobile } = req.body; // دریافت شماره موبایل از بدنه درخواست
      await this.#service.sendOTP(mobile); // ارسال کد OTP با استفاده از سرویس
      return res.json({
        message: AuthMessages.SendOtpSuccessfully, // ارسال پیام موفقیت
      });
    } catch (error) {
      next(error); // انتقال خطا به میدل‌ور مدیریت خطاها
    }
  }

  /**
   * بررسی کد OTP و صدور توکن در صورت موفقیت.
   * @param {Object} req - شیء درخواست شامل شماره موبایل و کد در بدنه.
   * @param {Object} res - شیء پاسخ برای ارسال توکن و پیام.
   * @param {Function} next - تابع میدل‌ور بعدی در صورت بروز خطا.
   */
  async checkOTP(req, res, next) {
    try {
      const { mobile, code } = req.body; // دریافت شماره موبایل و کد OTP از بدنه درخواست
      const token = await this.#service.checkOTP(mobile, code); // بررسی کد OTP و تولید توکن
      console.log("token", token);
      return res
        .cookie(CookieNames.AccessToken, token, {
          httpOnly: true, // کوکی فقط از طریق سرور قابل دسترسی است
          secure: process.env.NODE_ENV === NodeEnv.Production, // در محیط تولید، کوکی امن باشد
        })
        .status(200)
        .json({
          message: AuthMessages.loginSuccessfully, // ارسال پیام موفقیت ورود
          token, // ارسال توکن تولید شده
        });
    } catch (error) {
      next(error); // انتقال خطا به میدل‌ور مدیریت خطاها
    }
  }

  /**
   * خروج کاربر با پاک کردن کوکی مربوط به توکن دسترسی.
   * @param {Object} req - شیء درخواست.
   * @param {Object} res - شیء پاسخ برای ارسال وضعیت و پیام.
   * @param {Function} next - تابع میدل‌ور بعدی در صورت بروز خطا.
   */
  async logout(req, res, next) {
    try {
      return res
        .clearCookie(CookieNames.AccessToken) // پاک کردن کوکی مربوط به توکن دسترسی
        .status(200)
        .json({
          message: AuthMessages.logoutSuccessfully, // ارسال پیام موفقیت خروج
        });
    } catch (error) {
      next(error); // انتقال خطا به میدل‌ور مدیریت خطاها
    }
  }
}

// صادرات یک اینستنس از کلاس AuthController
module.exports = new AuthController();
