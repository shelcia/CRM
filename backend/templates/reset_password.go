package templates

import "fmt"

func ResetPasswordEmail(name, resetURL string) string {
	return fmt.Sprintf(`<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Reset Your Password</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet" />
  </head>
  <body style="margin:0;padding:0;background-color:#f4f4f4;font-family:'Poppins',sans-serif;">
    <table width="100%%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
            <tr>
              <td style="background:#2499EF;padding:32px 40px;text-align:center;">
                <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:600;">Tiny CRM</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:40px;">
                <h2 style="color:#1a1a2e;font-size:20px;margin-bottom:16px;">Hi %s,</h2>
                <p style="color:#555;line-height:1.6;margin-bottom:24px;">
                  We received a request to reset your password. Click the button below to create a new one.
                </p>
                <div style="text-align:center;margin:32px 0;">
                  <a href="%s" style="background:#2499EF;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:16px;display:inline-block;">
                    Reset Password
                  </a>
                </div>
                <p style="color:#888;font-size:13px;margin-top:24px;">
                  This link expires in 24 hours. If you didn't request a reset, you can ignore this email.
                </p>
              </td>
            </tr>
            <tr>
              <td style="background:#f8f9fa;padding:20px 40px;text-align:center;">
                <p style="color:#aaa;font-size:12px;margin:0;">&copy; 2024 Tiny CRM. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`, name, resetURL)
}
