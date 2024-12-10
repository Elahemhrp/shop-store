const { Router } = require(`express`); // وارد کردن Router از فریم‌ورک Express
const authController = require(`./auth.controller`); // وارد کردن کنترلر احراز هویت
const Authorization = require("../../common/guard/authorization.guard"); // وارد کردن میدل‌ور محافظت از مسیرها (Authorization Guard)

// ایجاد یک نمونه از Router
const router = Router();

// مسیر برای ارسال کد OTP
// این مسیر درخواست POST دریافت می‌کند و متد sendOTP از authController را فراخوانی می‌کند.
router.post("/send-otp", authController.sendOTP);

// مسیر برای بررسی کد OTP
// این مسیر درخواست POST دریافت می‌کند و متد checkOTP از authController را فراخوانی می‌کند.
router.post("/check-otp", authController.checkOTP);

// مسیر برای خروج کاربر
// این مسیر درخواست GET دریافت می‌کند و ابتدا میدل‌ور Authorization اجرا شده و سپس متد logout از authController فراخوانی می‌شود.
router.get("/logout", Authorization, authController.logout);

// صادرات روتر احراز هویت به صورت AuthRouter
module.exports = {
  AuthRouter: router,
};
