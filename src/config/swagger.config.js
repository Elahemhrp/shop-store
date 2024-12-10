// بارگذاری کتابخانه‌های مورد نیاز
const swaggerJsDoc = require("swagger-jsdoc"); // برای تولید مستندات Swagger از کدها
const swaggerUi = require("swagger-ui-express"); // برای ارائه رابط کاربری Swagger UI

// پیکربندی Swagger برای استفاده در اپلیکیشن
function SwaggerConfig(app) {
  // تعریف تنظیمات و جزئیات مستندات Swagger
  const swaggerDocument = swaggerJsDoc({
    swaggerDefinition: {
      openapi: "3.0.1", // نسخه OpenAPI
      info: {
        title: "divar-backend", // عنوان مستندات API
        description: "", // توضیحات مربوط به API
        version: "1.0.0", // نسخه API
      },
    },

    // مسیر فایل‌های Swagger که اطلاعات API را از آن دریافت می‌کند
    apis: [process.cwd() + "/src/modules/**/*.swagger.js"],
  });

  // تنظیمات Swagger UI برای نمایش مستندات به صورت گرافیکی
  const swagger = swaggerUi.setup(swaggerDocument, {});

  // استفاده از Swagger UI در روت اصلی اپلیکیشن
  app.use("/swagger", swaggerUi.serve, swagger);
}

module.exports = SwaggerConfig;
