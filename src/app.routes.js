// بارگذاری کتابخانه مورد نیاز برای روتینگ
const { Router } = require(`express`);

// بارگذاری روت‌های مختلف برای ماژول‌ها
const { AuthRouter } = require(`./modules/auth/auth.routes`); // روت‌های مربوط به احراز هویت
const { UserRouter } = require("./modules/user/user.routes"); // روت‌های مربوط به کاربران
const { CategoryRouter } = require("./modules/category/category.routes"); // روت‌های مربوط به دسته‌بندی‌ها
const { OptionRouter } = require("./modules/option/option.routes"); // روت‌های مربوط به گزینه‌ها
const { PostRouter } = require("./modules/post/post.routes"); // روت‌های مربوط به پست‌ها

// بارگذاری کنترلر پست‌ها (در صورت نیاز به کنترلر در داخل روت‌ها)
const postController = require("./modules/post/post.controller");

// ایجاد روت اصلی برای اپلیکیشن
const mainRouter = Router();

// استفاده از روت‌ها برای هر مسیر خاص
mainRouter.use("/auth", AuthRouter); // تمامی درخواست‌ها به /auth به روت‌های احراز هویت هدایت می‌شود
mainRouter.use("/user", UserRouter); // تمامی درخواست‌ها به /user به روت‌های کاربران هدایت می‌شود
mainRouter.use("/category", CategoryRouter); // تمامی درخواست‌ها به /category به روت‌های دسته‌بندی‌ها هدایت می‌شود
mainRouter.use("/option", OptionRouter); // تمامی درخواست‌ها به /option به روت‌های گزینه‌ها هدایت می‌شود
mainRouter.use("/post", PostRouter); // تمامی درخواست‌ها به /post به روت‌های پست‌ها هدایت می‌شود

// صادرات روت اصلی برای استفاده در اپلیکیشن
module.exports = mainRouter;
