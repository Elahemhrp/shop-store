// استفاده از Object.freeze برای جلوگیری از تغییرات در شیء CategoryMessages
const CategoryMessages = Object.freeze({
  // پیام موفقیت‌آمیز ایجاد دسته‌بندی
  Created: "Category created successfully",

  // پیام موفقیت‌آمیز حذف دسته‌بندی
  Deleted: "Category deleted successfully",

  // پیام زمانی که دسته‌بندی یافت نشود
  NotFound: "Category not found",

  // پیام زمانی که دسته‌بندی قبلاً وجود داشته باشد
  AlreadyExist: "Category has already exist",
});

// صادر کردن پیام‌های دسته‌بندی به صورت یک شیء
module.exports = {
  CategoryMessages, // صادر کردن شیء CategoryMessages برای استفاده در سایر قسمت‌های برنامه
};
