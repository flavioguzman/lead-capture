import { Resend } from 'resend';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export async function sendLeadMagnetEmail(email: string, title: string, downloadPath: string) {
  const downloadUrl = new URL(downloadPath, 'https://example.com').toString();

  try {
    const { data, error } = await resend.emails.send({
      from: 'Your Brand <download@yourdomain.com>',
      to: email,
      subject: `Your ${title} Download is Ready!`,
      html: `
        <div>
          <h1>Thank you for subscribing!</h1>
          <p>Here's your download of "${title}":</p>
          <p><a href="${downloadUrl}" style="
            display: inline-block;
            background: #4F46E5;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            margin: 16px 0;
          ">Download Now</a></p>
          <p style="color: #666; font-size: 14px;">
            If the button doesn't work, copy and paste this link:<br>
            ${downloadUrl}
          </p>
        </div>
      `
    });

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error };
  }
}