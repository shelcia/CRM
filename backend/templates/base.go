package templates

import "fmt"

func baseLayout(title, content string) string {
	return fmt.Sprintf(`<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>%s</title>
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
                %s
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
</html>`, title, content)
}
