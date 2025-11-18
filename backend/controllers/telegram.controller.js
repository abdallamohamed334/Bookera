// 🔥 استخدم Named Import
import { sendTelegramNotification } from "../utils/telegram.js";

export const sendTelegramMessage = async (req, res) => {
  try {
    const { 
      name, 
      phone, 
      venue, 
      date, 
      email, 
      guests, 
      package: pkg, 
      price, 
      notes, 
      type 
    } = req.body;
    
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    let message = `🎊 *طلب ${type || 'حجز'} جديد* 🎊\n\n`;
    message += `🏢 *القاعة:* ${venue}\n`;
    message += `👤 *الاسم:* ${name}\n`;
    message += `📞 *الهاتف:* ${phone}\n`;
    
    if (email) message += `📧 *البريد:* ${email}\n`;
    if (date) message += `📅 *التاريخ:* ${date}\n`;
    if (guests) message += `👥 *عدد الضيوف:* ${guests}\n`;
    if (pkg) message += `📦 *الباكدج:* ${pkg}\n`;
    if (price) message += `💰 *السعر:* ${parseInt(price).toLocaleString()} جنيه\n`;
    if (notes) message += `📝 *ملاحظات:* ${notes}\n`;
    
    message += `\n⏰ *وقت الطلب:* ${new Date().toLocaleString('ar-EG')}`;

    const success = await sendTelegramNotification(botToken, chatId, message);

    if (success) {
      res.json({ success: true, message: "تم إرسال الإشعار بنجاح ✅" });
    } else {
      res.status(500).json({ success: false, message: "فشل إرسال الإشعار ❌" });
    }
  } catch (error) {
    console.error('Error in sendTelegramMessage:', error);
    res.status(500).json({ success: false, message: "حدث خطأ في الخادم ❌" });
  }
};