// این کد یک شیء ثابت حاوی پیام‌های مختلف برای خطاهای مربوط به احراز هویت است.
const AuthorizationMassage = Object.freeze({
  // پیامی که به کاربر هنگام عدم ورود به حساب کاربری نمایش داده می‌شود.
  Login: "Login on your account",

  // پیامی که به کاربر هنگام نیاز به ورود دوباره به حساب کاربری نمایش داده می‌شود.
  LoginAgain: "Please login again",

  // پیامی که به کاربر هنگام نیاز به احراز هویت مجدد به دلیل عدم دسترسی مناسب نمایش داده می‌شود.
  Unauthorized: "Unauthorized please login again",

  // پیامی که به کاربر هنگامی که حساب کاربری پیدا نمی‌شود نمایش داده می‌شود.
  NotFoundAccount: "Not found account",

  // پیامی که به کاربر هنگام نامعتبر بودن توکن ارسال می‌شود.
  InvalidToken: "Token is invalid",
});

// با استفاده از Object.freeze این شیء غیرقابل تغییر می‌شود تا از تغییرات تصادفی جلوگیری شود.
module.exports = AuthorizationMassage;
