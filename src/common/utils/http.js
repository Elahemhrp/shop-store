// بارگذاری متغیرهای محیطی از فایل .env
require("dotenv").config();

// وارد کردن axios برای ارسال درخواست‌های HTTP
const { default: axios } = require("axios");

/**
 * تابع getAddressDetail برای دریافت جزئیات آدرس از مختصات جغرافیایی (عرض و طول جغرافیایی)
 * از یک سرویس نقشه استفاده می‌کند و اطلاعات مربوط به استان، شهر، منطقه و آدرس را باز می‌گرداند.
 *
 * @param {number} lat - عرض جغرافیایی (latitude)
 * @param {number} lng - طول جغرافیایی (longitude)
 * @returns {Promise<Object>} - یک شیء حاوی اطلاعات استان، شهر، منطقه و آدرس
 */
const getAddressDetail = async (lat, lng) => {
  // ارسال درخواست به سرویس نقشه با استفاده از axios
  const result = await axios
    .get(`${process.env.MAP_IR_URL}?lat=${lat}&lon=${lng}`, {
      headers: {
        // استفاده از کلید API از متغیر محیطی
        "x-api-key": process.env.MAP_API_KEY,
      },
    })
    .then((res) => res.data); // بازگرداندن داده‌های دریافت شده از پاسخ

  // بازگشت اطلاعات مورد نیاز: استان، شهر، منطقه و آدرس
  return {
    province: result.province, // استان
    city: result.city, // شهر
    district: result.region, // منطقه
    address: result.address, // آدرس کامل
  };
};

// صادر کردن تابع getAddressDetail برای استفاده در سایر بخش‌های برنامه
module.exports = {
  getAddressDetail,
};
