package templates

import "fmt"

func ResetPasswordEmail(name, resetURL string) string {
	content := fmt.Sprintf(`
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
    </p>`, name, resetURL)

	return baseLayout("Reset Your Password", content)
}
