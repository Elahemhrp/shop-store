// استفاده از Object.freeze برای جلوگیری از تغییر مقادیر شیء OptionMessages
const OptionMessages = Object.freeze({
  // پیام موفقیت‌آمیز برای زمانی که گزینه جدید ایجاد می‌شود
  Created: "Option created successfully",

  // پیام موفقیت‌آمیز برای زمانی که گزینه با موفقیت حذف می‌شود
  Deleted: "Option deleted successfully",

  // پیام موفقیت‌آمیز برای زمانی که گزینه به‌روزرسانی می‌شود
  Updated: "Option updated successfully",

  // پیام خطا برای زمانی که گزینه یافت نمی‌شود
  NotFound: "Option not found",

  // پیام خطا برای زمانی که گزینه قبلاً وجود داشته باشد
  AlreadyExist: "Option has already exist",
});

// صادر کردن شیء OptionMessages برای استفاده در سایر بخش‌ها
module.exports = {
  OptionMessages,
};
