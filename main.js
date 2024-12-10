// بارگذاری کتابخانه‌های مورد نیاز
const express = require(`express`); // برای راه‌اندازی سرور Express
const dotenv = require(`dotenv`); // برای بارگذاری متغیرهای محیطی از فایل .env
const cors = require("cors");
const moment = require(`jalali-moment`); // برای کار با تاریخ و زمان به تقویم جلالی
const swaggerConfig = require(`./src/config/swagger.config`); // برای تنظیمات Swagger (مستندسازی API)
const mainRouter = require(`./src/app.routes`); // برای مسیرهای اصلی اپلیکیشن
const NotFoundHandler = require(`./src/common/exception/notfound.handler`); // برای مدیریت خطاهای 404
const AllExceptionHandler = require(`./src/common/exception/all-exception.handler`); // برای مدیریت تمام خطاها
const cookieParser = require(`cookie-parser`); // برای مدیریت کوکی‌ها
const expressEjsLayouts = require(`express-ejs-layouts`); // برای استفاده از Layout در EJS
const methodOverride = require("method-override"); // برای استفاده از متدهای HTTP دیگر مانند PUT و DELETE

// بارگذاری متغیرهای محیطی از فایل .env
dotenv.config();

// تابع اصلی که سرور را راه‌اندازی می‌کند
async function main() {
  const app = express(); // ایجاد نمونه جدید از اپلیکیشن Express
  const PORT = process.env.PORT || 3000; // تعیین پورت، اول از متغیر محیطی PORT، در غیر این صورت از پورت 3000 استفاده می‌شود

  // بارگذاری تنظیمات اتصال به دیتابیس MongoDB
  require("./src/config/mongoose.config");

  // تنظیمات میانه‌افزارها
  app.use(express.json()); // برای پردازش داده‌های JSON در درخواست‌ها
  app.use(express.urlencoded({ extended: true })); // برای پردازش داده‌های فرم URL-encoded
  app.use(cookieParser(process.env.COOKIE_SECRET_KEY)); // برای پردازش و رمزنگاری کوکی‌ها
  app.use(express.static("public")); // برای سرو فایل‌های استاتیک از پوشه public
  app.use(cors());

  // تنظیمات Swagger برای مستندسازی API
  swaggerConfig(app);

  // افزودن مسیرهای اصلی به اپلیکیشن
  app.use(mainRouter);

  // اضافه کردن moment به اپلیکیشن برای استفاده در ویوها
  app.locals.moment = moment;

  // تنظیمات مدیریت خطاهای 404
  NotFoundHandler(app);

  // تنظیمات مدیریت تمام استثناها
  AllExceptionHandler(app);

  // راه‌اندازی سرور و گوش دادن به درخواست‌ها
  app.listen(PORT, () => {
    console.log(`server: http://localhost:${PORT}`); // پیام موفقیت‌آمیز برای نشان دادن آدرس سرور
  });
}

// اجرای تابع اصلی برای راه‌اندازی سرور
main();
