// تعریف یک شیء ثابت با استفاده از Object.freeze
// این شیء حاوی مقادیری است که نمایانگر محیط‌های مختلف اپلیکیشن می‌باشد.
// استفاده از Object.freeze باعث می‌شود که این شیء تغییرناپذیر باشد و مقادیر آن قابل تغییر نباشند.
const NodeEnv = Object.freeze({
  // محیط تولید (Production) که برای زمانی استفاده می‌شود که اپلیکیشن آماده است
  // و در حال اجرا در محیط واقعی (مثلاً برای کاربران نهایی) است.
  Production: "production",

  // محیط توسعه (Development) که معمولاً برای تست و توسعه اپلیکیشن استفاده می‌شود.
  // در این حالت ممکن است ویژگی‌هایی مانند لاگ‌های بیشتر یا ابزارهای دیباگ فعال باشند.
  Develpment: "development",
});

// صادر کردن شیء NodeEnv برای استفاده در سایر بخش‌های اپلیکیشن.
// این کار اجازه می‌دهد که در سایر فایل‌ها بتوان از این مقادیر ثابت به‌طور یکسان استفاده کرد
// و از خطاهای تایپی جلوگیری کرد.
module.exports = NodeEnv;
