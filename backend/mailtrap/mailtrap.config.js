import { Resend } from "resend";

// ضع هنا مفتاح API الحقيقي الخاص بك من Resend Dashboard
const resend = new Resend("re_3Z7zDfvW_AdeHYec2b1CozA2dgjpDXhCr");

// المرسل (يفضل أن يكون دومين مفعل في Resend)
const sender = "onboarding@resend.dev";

// دالة لإرسال البريد لأي إيميل يُعطى لها
const sendTestMail = async (recipientEmail) => {
  try {
    const result = await resend.emails.send({
      from: sender,
      to: [recipientEmail],
      subject: "You are awesome!",
      html: `
        <p>Congrats 🎉</p>
        <p>This email was sent successfully using <strong>Resend API</strong>.</p>
      `,
    });

    console.log("✅ Email sent successfully:", result);
  } catch (error) {
    console.error("❌ Error sending mail:", error.message || error);
  }
};

// مثال: إرسال البريد لإيميل يتم إدخاله
const userEmail = "user@example.com"; // هنا ممكن تاخد القيمة من نموذج تسجيل
sendTestMail(userEmail);
