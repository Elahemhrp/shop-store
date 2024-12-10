/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: مدیریت پست‌ها
 */

/**
 * @swagger
 * /posts/create:
 *   get:
 *     summary: دریافت صفحه ایجاد پست
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: موفقیت در دریافت صفحه ایجاد پست
 */

/**
 * @swagger
 * /posts/create:
 *   post:
 *     summary: ایجاد پست جدید
 *     tags: [Posts]
 *     description: ایجاد پست جدید با آپلود تصاویر و اطلاعات مربوط به پست.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title_post:
 *                 type: string
 *                 description: عنوان پست
 *               description:
 *                 type: string
 *                 description: محتوای پست
 *               lat:
 *                 type: number
 *                 description: عرض جغرافیایی
 *               lng:
 *                 type: number
 *                 description: طول جغرافیایی
 *               category:
 *                 type: string
 *                 description: شناسه دسته‌بندی
 *               amount:
 *                 type: number
 *                 description: مبلغ پست
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: تصاویر بارگذاری‌شده
 *     responses:
 *       200:
 *         description: پست با موفقیت ایجاد شد
 *       400:
 *         description: خطای ورودی
 */

/**
 * @swagger
 * /posts/my:
 *   get:
 *     summary: دریافت پست‌های کاربر
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: موفقیت در دریافت پست‌های کاربر
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 posts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Post'
 *                 count:
 *                   type: integer
 *                   description: تعداد پست‌ها
 *                 success_message:
 *                   type: string
 *                   description: پیام موفقیت
 */

/**
 * @swagger
 * /posts/delete/{id}:
 *   get:
 *     summary: حذف پست
 *     tags: [Posts]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: شناسه پست برای حذف
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: پست با موفقیت حذف شد
 *       404:
 *         description: پست یافت نشد
 */

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: نمایش جزئیات یک پست خاص
 *     tags: [Posts]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: شناسه پست
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: موفقیت در دریافت پست
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: پست یافت نشد
 */

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: دریافت لیست پست‌ها
 *     tags: [Posts]
 *     parameters:
 *       - name: query
 *         in: query
 *         description: پارامترهای جستجو برای پست‌ها
 *         schema:
 *           type: object
 *     responses:
 *       200:
 *         description: موفقیت در دریافت لیست پست‌ها
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 posts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Post'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: عنوان پست
 *         content:
 *           type: string
 *           description: محتوای پست
 *         amount:
 *           type: number
 *           description: مبلغ پست
 *         category:
 *           type: string
 *           description: شناسه دسته‌بندی
 *         images:
 *           type: array
 *           items:
 *             type: string
 *             format: binary
 *           description: تصاویر پست
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: زمان ایجاد پست
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: زمان آخرین به‌روزرسانی پست
 */
