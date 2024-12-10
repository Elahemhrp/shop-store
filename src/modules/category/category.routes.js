// وارد کردن Router از express برای مدیریت مسیرها
const { Router } = require("express");
// وارد کردن کنترلر دسته‌بندی برای انجام عملیات مرتبط با دسته‌بندی‌ها
const categoryController = require("./category.controller");

// ایجاد یک شیء از Router برای تعریف مسیرهای مختلف
const router = Router();

// مسیر POST برای ایجاد یک دسته‌بندی جدید
router.post("/", categoryController.create); // فراخوانی متد create از کنترلر دسته‌بندی

// مسیر GET برای دریافت لیست همه دسته‌بندی‌ها
router.get("/", categoryController.find); // فراخوانی متد find از کنترلر دسته‌بندی

// مسیر DELETE برای حذف یک دسته‌بندی خاص بر اساس شناسه
router.delete("/:id", categoryController.remove); // فراخوانی متد remove از کنترلر دسته‌بندی و دریافت شناسه از پارامترهای مسیر

// صادر کردن شیء router به عنوان CategoryRouter برای استفاده در سایر بخش‌های برنامه
module.exports = {
  CategoryRouter: router, // صادر کردن مسیرها
};
