// تابع isTrue بررسی می‌کند که آیا مقدار ورودی به صورت "true"، 1 یا true باشد.
// این تابع برای تشخیص مقادیر مختلفی که به عنوان true در نظر گرفته می‌شوند استفاده می‌شود.
const isTrue = (value) => ["true", 1, true].includes(value);

// تابع isFalse بررسی می‌کند که آیا مقدار ورودی به صورت "false"، 0 یا false باشد.
// این تابع برای تشخیص مقادیر مختلفی که به عنوان false در نظر گرفته می‌شوند استفاده می‌شود.
const isFalse = (value) => ["false", 0, false].includes(value);

// تابع removePropertiesInObject از یک شیء target و آرایه‌ای از خصوصیات، آن خصوصیات را از شیء حذف می‌کند.
// این تابع مفید است وقتی بخواهیم برخی از ویژگی‌های شیء را حذف کنیم بدون اینکه خود شیء را تغییر دهیم.
const removePropertiesInObject = (target = {}, properties = []) => {
  // برای هر خصوصیتی که در آرایه properties آمده است، از شیء target حذف می‌شود.
  for (const item of properties) {
    delete target[item];
  }
  // در نهایت شیء هدف که از خصوصیات مشخص شده پاک شده، باز می‌گردد.
  return target;
};

// در این قسمت سه تابع `isTrue`، `isFalse` و `removePropertiesInObject` برای استفاده در سایر بخش‌های برنامه صادر می‌شوند.
module.exports = {
  isTrue,
  isFalse,
  removePropertiesInObject,
};
