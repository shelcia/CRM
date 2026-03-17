package templates

import "fmt"

func InviteUserEmail(name, email, tempPassword string) string {
	return fmt.Sprintf(`<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>You're Invited to Tiny CRM</title>
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
                  You've been invited to join Tiny CRM. Here are your login credentials:
                </p>
                <div style="background:#f8f9fa;border-radius:8px;padding:20px;margin:24px 0;">
                  <p style="margin:0 0 8px 0;color:#555;"><strong>Email:</strong> %s</p>
                  <p style="margin:0;color:#555;"><strong>Temporary Password:</strong> %s</p>
                </div>
                <p style="color:#888;font-size:13px;">
                  Please log in and change your password as soon as possible.
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
</html>`, name, email, tempPassword)
}
