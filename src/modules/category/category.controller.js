const autoBind = require("auto-bind"); // برای اطمینان از اینکه تمام متدهای کلاس به درستی متصل می‌شوند
const categoryService = require("./category.service"); // وارد کردن سرویس دسته‌بندی
const { CategoryMessages } = require("./category.messages"); // وارد کردن پیام‌های مرتبط با دسته‌بندی
const HttpCodes = require(`http-codes`); // وارد کردن کدهای وضعیت HTTP برای استفاده در پاسخ‌ها
const createHttpError = require("http-errors");

class CategoryController {
  #service; // سرویس دسته‌بندی برای انجام عملیات روی دسته‌بندی‌ها

  constructor() {
    autoBind(this); // متصل کردن متدها به شیء برای استفاده بدون نیاز به bind
    this.#service = categoryService; // تنظیم سرویس دسته‌بندی
  }

  // متد برای ایجاد دسته‌بندی جدید
  async create(req, res, next) {
    try {
      const { name, slug, icon, parent } = req.body; // دریافت اطلاعات دسته‌بندی از درخواست
      await this.#service.create({ name, slug, icon, parent }); // ارسال اطلاعات به سرویس برای ایجاد دسته‌بندی
      return res.status(201).json({
        // ارسال پاسخ موفقیت‌آمیز با کد 201
        message: CategoryMessages.Created, // پیام موفقیت‌آمیز از پیام‌های دسته‌بندی
      });
    } catch (error) {
      next(error); // در صورت بروز خطا، فراخوانی متد next برای پردازش خطا
    }
  }

  // متد برای دریافت لیست دسته‌بندی‌ها
  async find(req, res, next) {
    try {
      const categories = await this.#service.find(); // دریافت دسته‌بندی‌ها از سرویس
      return res.status(200).json({
        // ارسال پاسخ موفقیت‌آمیز با کد 200
        data: categories, // بازگشت داده‌های دسته‌بندی‌ها
      });
    } catch (error) {
      next(error); // در صورت بروز خطا، فراخوانی متد next برای پردازش خطا
    }
  }

  // متد برای حذف دسته‌بندی بر اساس شناسه
  async remove(req, res, next) {
    try {
      const { id } = req.params; // دریافت شناسه دسته‌بندی از پارامترهای درخواست
      await this.#service.remove(id); // حذف دسته‌بندی از سرویس
      return res.status(200).json({
        // ارسال پاسخ موفقیت‌آمیز با کد 200
        message: CategoryMessages.Deleted, // پیام موفقیت‌آمیز از پیام‌های دسته‌بندی
      });
    } catch (error) {
      next(error); // در صورت بروز خطا، فراخوانی متد next برای پردازش خطا
    }
  }
}

module.exports = new CategoryController(); // صادر کردن شیء CategoryController
