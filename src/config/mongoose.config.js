// بارگذاری کتابخانه‌های مورد نیاز
const { default: mongoose } = require(`mongoose`); // برای اتصال به پایگاه داده MongoDB
const dotenv = require(`dotenv`); // برای مدیریت متغیرهای محیطی

// بارگذاری متغیرهای محیطی از فایل .env
dotenv.config();

// اتصال به پایگاه داده MongoDB
mongoose
  .connect(process.env.MONGODB_URL) // استفاده از URL پایگاه داده که در فایل .env مشخص شده است
  .then(() => {
    // در صورت اتصال موفقیت‌آمیز، پیام موفقیت در کنسول نمایش داده می‌شود
    console.log("connected to DB");
  })
  .catch((err) => {
    // در صورت بروز خطا، پیام خطا در کنسول نمایش داده می‌شود
    console.log(err?.message ?? `Failed DB Connection`);
  });
