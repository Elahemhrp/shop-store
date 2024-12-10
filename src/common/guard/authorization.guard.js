// این کد یک middleware است که برای بررسی و تأیید اعتبار توکن JWT در درخواست‌ها استفاده می‌شود.
const createHttpError = require(`http-errors`);
const AuthorizationMassage = require("../messages/auth.message");
const jwt = require(`jsonwebtoken`);
const UserModel = require("../../modules/user/user.model");

require("dotenv").config();

// این تابع برای تایید اعتبار توکن JWT در درخواست‌ها است
const Authorization = async (req, res, next) => {
  try {
    // ابتدا توکن از کوکی‌ها استخراج می‌شود
    const token = req?.cookies?.access_token;

    // اگر توکن وجود نداشت، یک خطای Unauthorized (غیرمجاز) به کاربر ارسال می‌شود
    if (!token)
      throw new createHttpError.Unauthorized(AuthorizationMassage.Login);

    // توکن با استفاده از کلید JWT مخفی بررسی و معتبرسازی می‌شود
    const data = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // اگر داده‌های موجود در توکن معتبر بودند (و حاوی شناسه کاربر بودند)
    if (typeof data === "object" && "id" in data) {
      // اطلاعات کاربر از پایگاه داده با استفاده از شناسه موجود در توکن بازیابی می‌شود
      const user = await UserModel.findById(data.id, {
        accessToken: 0, // فیلدهای اضافی که نباید به کاربر بازگشت داده شوند، حذف می‌شوند.
        otp: 0,
        __v: 0,
        updatedAt: 0,
        verifiedMobile: 0,
      }).lean();

      // اگر کاربر یافت نشد، یک خطای Unauthorized (غیرمجاز) ارسال می‌شود
      if (!user)
        throw new createHttpError.Unauthorized(
          AuthorizationMassage.NotFoundAccount
        );

      // اطلاعات کاربر در شیء درخواست (req) ذخیره می‌شود
      req.user = user;
      return next(); // اجازه می‌دهد درخواست به مراحل بعدی پردازش منتقل شود
    }

    // اگر داده‌ها معتبر نباشند یا توکن غیرمعتبر باشد، یک خطای Unauthorized (غیرمجاز) ارسال می‌شود
    throw new createHttpError.Unauthorized(AuthorizationMassage.InvalidToken);
  } catch (error) {
    // هرگونه خطا در طول فرآیند، به middleware خطاها ارسال می‌شود
    next(error);
  }
};

module.exports = Authorization;
