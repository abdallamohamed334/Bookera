import fetch from "node-fetch";

// 🔥 استخدم Named Export بالطريقة الصحيحة
export const sendTelegramNotification = async (botToken, chatId, message) => {
  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown"
      })
    });
    return response.ok;
  } catch (err) {
    console.error("Telegram Error:", err);
    return false;
  }
};

// 🔥 لا تستخدم export default إضافي