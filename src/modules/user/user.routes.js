// ایمپورت کردن Router از Express برای ایجاد روت‌ها
const { Router } = require("express");

// ایمپورت کردن کنترلر کاربر که منطق درخواست‌های مربوط به کاربران را مدیریت می‌کند
const userController = require("./user.controller");

// ایمپورت کردن گارد احراز هویت (Authorization guard) برای بررسی دسترسی کاربر
const Authorization = require("../../common/guard/authorization.guard");

// ایجاد یک نمونه از Router برای تعریف روت‌ها
const router = Router();

// تعریف روت برای درخواست GET به مسیر "/whoami"
// این روت برای شناسایی کاربر وارد شده استفاده می‌شود و از گارد Authorization برای بررسی دسترسی استفاده می‌کند
router.get("/whoami", Authorization, userController.whoami);

// صادرات روت به نام UserRouter برای استفاده در دیگر بخش‌های اپلیکیشن
module.exports = {
  UserRouter: router, // صادر کردن روت‌ها به عنوان UserRouter
};
