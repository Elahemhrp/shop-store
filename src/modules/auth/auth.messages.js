const AuthMessages = {
  // پیام موفقیت‌آمیز برای ارسال کد OTP
  SendOtpSuccessfully: "Send otp successfully!",

  // پیام خطا در صورت عدم یافتن کاربر
  NotFound: "User not found!",

  // پیام خطا در صورت تلاش برای دریافت مجدد کد OTP قبل از انقضای کد قبلی
  OtpCodeNotEpired: "Otp code not expired, please try later",

  // پیام خطا در صورت انقضای کد OTP
  OtpCodeEpired: "Otp code has expired, please try again to get new code",

  // پیام خطا در صورت نادرست بودن کد OTP
  OtpCodeIsIncorrect: "Otp code is incorrect",

  // پیام موفقیت‌آمیز برای ورود کاربر
  loginSuccessfully: "your login successfully",

  // پیام موفقیت‌آمیز برای خروج کاربر
  logoutSuccessfully: "Successfully logged out",
};

// صادرات شیء AuthMessages برای استفاده در سایر فایل‌ها
module.exports = {
  AuthMessages,
};
