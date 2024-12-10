const { Router } = require("express"); // وارد کردن Router از express برای مدیریت مسیرها
const optionController = require("./option.controller"); // وارد کردن کنترلر مربوط به گزینه‌ها

// ایجاد یک شی از Router برای تعریف مسیرهای API
const router = Router();

// تعریف مسیر POST برای ایجاد یک گزینه جدید
router.post("/", optionController.create);

// تعریف مسیر GET برای دریافت گزینه‌ها بر اساس شناسه دسته‌بندی
router.get("/by-category/:categoryId", optionController.findByCategoryId);

// تعریف مسیر GET برای دریافت گزینه‌ها بر اساس slug دسته‌بندی
router.get("/by-category-slug/:slug", optionController.findByCategorySlug);

// تعریف مسیر GET برای دریافت گزینه بر اساس شناسه
router.get("/:id", optionController.findById);

// تعریف مسیر DELETE برای حذف گزینه بر اساس شناسه
router.delete("/:id", optionController.removeById);

// تعریف مسیر GET برای دریافت تمام گزینه‌ها
router.get("/", optionController.find);

// تعریف مسیر PUT برای به‌روزرسانی گزینه بر اساس شناسه
router.put("/:id", optionController.update);

// صادر کردن router برای استفاده در بخش‌های دیگر برنامه
module.exports = {
  OptionRouter: router,
};
