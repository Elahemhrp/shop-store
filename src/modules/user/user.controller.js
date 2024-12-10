// وارد کردن ماژول‌های مورد نیاز

const autoBind = require(`auto-bind`); // وارد کردن کتابخانه auto-bind برای اتصال خودکار متدها به نمونه کلاس
const NodeEnv = require("../../common/constants/env.enum"); // وارد کردن ثابت‌های مربوط به محیط (در حال حاضر در کد استفاده نمی‌شود)

// تعریف کلاس UserController
class UserController {
  #service; // ویژگی خصوصی برای ذخیره نمونه سرویس کاربر

  // سازنده کلاس که سرویس کاربر را مقداردهی اولیه کرده و متدها را به نمونه متصل می‌کند
  constructor() {
    autoBind(this); // اتصال خودکار تمامی متدهای کلاس به نمونه
  }

  // متدی برای بازگرداندن اطلاعات کاربر وارد شده (کاربر فعلی)
  async whoami(req, res, next) {
    try {
      const user = req.user; // استخراج اطلاعات کاربر از شیء درخواست (req)
      return res.json(user); // ارسال اطلاعات کاربر به صورت JSON به کلاینت
    } catch (error) {
      next(error); // ارسال خطا به middleware بعدی در صورت بروز مشکل
    }
  }
}

// صادر کردن نمونه UserController برای استفاده در سایر بخش‌های اپلیکیشن
module.exports = new UserController();
