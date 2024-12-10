// این تابع برای مدیریت خطاها در اپلیکیشن استفاده می‌شود.
function AllExceptionHandler(app) {
  // استفاده از middleware برای مدیریت خطاها
  app.use((err, req, res, next) => {
    // ابتدا تلاش می‌شود که وضعیت خطا (status) از شیء خطا (err) دریافت شود.
    let status = err?.status ?? err?.statusCode ?? err?.code;

    // اگر وضعیت خطا نامعتبر باشد (مثلاً عدد نباشد یا در بازه معتبر نباشد)، به‌طور پیش‌فرض وضعیت 500 (خطای سرور داخلی) تنظیم می‌شود.
    if (!status || isNaN(+status) || status > 511 || status < 200) status = 500;

    // پاسخ خطا به کاربر ارسال می‌شود. در اینجا پیام خطا یا stack trace خطا برگردانده می‌شود.
    res.status(status).json({
      message: err?.message ?? err?.stack ?? `InternalServerError`,
    });
  });
}

module.exports = AllExceptionHandler;
