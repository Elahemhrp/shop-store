const { Router } = require("express");
const postController = require("./post.controller");
const { upload } = require("../../common/utils/multer");
const Authorization = require("../../common/guard/authorization.guard");

const router = Router();

// اعمال گارد احراز هویت برای تمام مسیرهای بعدی
router.use(Authorization);

// مسیر برای ایجاد پست جدید همراه با آپلود تصاویر (حداکثر 10 تصویر)
router.post("/create", upload.array("images", 10), postController.create);

// مسیر برای دریافت صفحه ایجاد پست
router.get("/create", postController.createPostPage);

// مسیر برای دریافت پست‌های کاربر جاری
router.get("/my", postController.findMyPosts);

// مسیر برای حذف یک پست خاص بر اساس ID
router.get("/delete/:id", postController.remove);

// مسیر برای نمایش یک پست خاص بر اساس ID
router.get("/:id", postController.showPost);

// مسیر برای دریافت لیست تمام پست‌ها
router.get("/", postController.postsList);

module.exports = {
  PostRouter: router, // صادر کردن روت‌های مربوط به پست
};
