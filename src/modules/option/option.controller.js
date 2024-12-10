const autoBind = require("auto-bind");
const optionService = require("./option.service");
const { OptionMessages } = require("./option.messages");
const HttpCodes = require(`http-codes`);
const createHttpError = require("http-errors");

class OptionController {
  #service;

  // سازنده کلاس که سرویس مربوط به Option را راه‌اندازی می‌کند
  constructor() {
    autoBind(this); // استفاده از auto-bind برای متصل کردن این متدها به نمونه کلاس
    this.#service = optionService; // اتصال سرویس مربوط به option
  }

  // متد برای ایجاد یک گزینه جدید
  async create(req, res, next) {
    try {
      // دریافت اطلاعات مورد نیاز از درخواست
      const {
        title,
        key,
        type,
        category,
        guide,
        enum: list,
        required,
      } = req.body;

      // فراخوانی متد create از سرویس optionService
      const option = await this.#service.create({
        title,
        key,
        type,
        category,
        guide,
        enum: list,
        required,
      });

      // ارسال پاسخ با وضعیت موفقیت‌آمیز و اطلاعات گزینه جدید
      return res.status(201).json({
        message: OptionMessages.Created,
        option,
      });
    } catch (error) {
      next(error); // ارسال خطا به میانه‌افزار خطا
    }
  }

  // متد برای به‌روزرسانی یک گزینه
  async update(req, res, next) {
    try {
      const {
        title,
        key,
        type,
        category,
        guide,
        enum: list,
        required,
      } = req.body;
      const { id } = req.params;

      // فراخوانی متد update از سرویس برای به‌روزرسانی اطلاعات
      const newOption = await this.#service.update(id, {
        title,
        key,
        type,
        category,
        guide,
        enum: list,
        required,
      });

      // ارسال پاسخ با وضعیت موفقیت‌آمیز و اطلاعات گزینه به‌روزرسانی شده
      return res.status(200).json({
        message: OptionMessages.Updated,
        newOption,
      });
    } catch (error) {
      next(error); // ارسال خطا به میانه‌افزار خطا
    }
  }

  // متد برای یافتن گزینه‌ها بر اساس شناسه دسته‌بندی
  async findByCategoryId(req, res, next) {
    try {
      const categoryId = req.params.categoryId; // دریافت شناسه دسته‌بندی از پارامتر درخواست
      console.log("categoryId:", categoryId); // چاپ شناسه دسته‌بندی برای بررسی

      // فراخوانی متد findByCategoryId از سرویس برای یافتن گزینه‌ها
      const options = await this.#service.findByCategoryId(categoryId);
      return res.json({ options }); // ارسال پاسخ با لیست گزینه‌ها
    } catch (error) {
      next(error); // ارسال خطا به میانه‌افزار خطا
    }
  }

  // متد برای یافتن گزینه‌ها بر اساس slug دسته‌بندی
  async findByCategorySlug(req, res, next) {
    try {
      const slug = req.params.slug; // دریافت slug از پارامتر درخواست
      console.log(slug); // چاپ slug برای بررسی

      // فراخوانی متد findByCategorySlug از سرویس برای یافتن گزینه‌ها
      const option = await this.#service.findByCategorySlug(slug);
      return res.json(option); // ارسال پاسخ با گزینه مربوطه
    } catch (error) {
      next(error); // ارسال خطا به میانه‌افزار خطا
    }
  }

  // متد برای یافتن گزینه‌ها بر اساس شناسه
  async findById(req, res, next) {
    try {
      const { id } = req.params; // دریافت شناسه از پارامتر درخواست

      // فراخوانی متد findById از سرویس برای یافتن گزینه
      const option = await this.#service.findById(id);
      return res.json(option); // ارسال پاسخ با گزینه پیدا شده
    } catch (error) {
      next(error); // ارسال خطا به میانه‌افزار خطا
    }
  }

  // متد برای حذف یک گزینه بر اساس شناسه
  async removeById(req, res, next) {
    try {
      const { id } = req.params; // دریافت شناسه از پارامتر درخواست

      // فراخوانی متد removeById از سرویس برای حذف گزینه
      await this.#service.removeById(id);
      return res.json({
        message: OptionMessages.Deleted, // ارسال پیام موفقیت‌آمیز حذف
      });
    } catch (error) {
      next(error); // ارسال خطا به میانه‌افزار خطا
    }
  }

  // متد برای یافتن همه گزینه‌ها
  async find(req, res, next) {
    try {
      // فراخوانی متد find از سرویس برای یافتن همه گزینه‌ها
      const options = await this.#service.find();
      return res.json({
        options, // ارسال پاسخ با لیست همه گزینه‌ها
      });
    } catch (error) {
      next(error); // ارسال خطا به میانه‌افزار خطا
    }
  }
}

module.exports = new OptionController(); // ایجاد و صادر کردن نمونه از کنترلر
