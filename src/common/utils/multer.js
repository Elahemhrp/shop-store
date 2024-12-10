// بارگذاری کتابخانه‌های مورد نیاز
const multer = require("multer"); // برای مدیریت آپلود فایل
const fs = require("fs"); // برای دستکاری فایل‌ها و پوشه‌ها
const path = require("path"); // برای مدیریت مسیر فایل‌ها
const createHttpError = require("http-errors"); // برای ایجاد خطاهای HTTP

// تنظیمات ذخیره‌سازی فایل‌ها با استفاده از multer
const storage = multer.diskStorage({
  // مشخص کردن مسیر ذخیره‌سازی فایل‌ها
  destination: function (req, file, cb) {
    // مسیر ذخیره‌سازی فایل‌ها در پوشه "public/upload"
    const uploadPath = path.join(process.cwd(), "public", "upload");

    // ایجاد پوشه "upload" در صورت وجود نداشتن آن
    fs.mkdirSync(uploadPath, { recursive: true });

    // تعیین مقصد ذخیره فایل‌ها
    cb(null, uploadPath);
  },

  // تعیین نام فایل‌های ذخیره‌شده
  filename: function (req, file, cb) {
    // لیست فرمت‌های مجاز برای فایل‌ها
    const whiteListFormat = [
      "image/png",
      "image/jpg",
      "image/jpeg",
      "image/webp",
    ];

    // بررسی اینکه فرمت فایل در لیست مجاز باشد
    if (whiteListFormat.includes(file.mimetype)) {
      // استخراج فرمت فایل (مانند .png یا .jpg)
      const format = path.extname(file.originalname);

      // ایجاد نام فایل جدید با استفاده از زمان فعلی
      const filename = new Date().getTime().toString() + format;

      // تعیین نام فایل جدید
      cb(null, filename);
    } else {
      // در صورت عدم مجاز بودن فرمت فایل، ایجاد خطا
      cb(new createHttpError.BadRequest("format of pictures are wrong!"));
    }
  },
});

// تنظیمات multer برای محدودیت اندازه فایل و ذخیره‌سازی
const upload = multer({
  storage, // استفاده از تنظیمات ذخیره‌سازی
  limits: {
    // محدودیت اندازه فایل‌ها به 3MB
    fileSize: 3 * 1000 * 1000,
  },
});

// صادر کردن تنظیمات upload برای استفاده در سایر بخش‌ها
module.exports = {
  upload,
};
