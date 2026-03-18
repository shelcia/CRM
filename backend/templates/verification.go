package templates

import "fmt"

func VerificationEmail(name, verificationURL string) string {
	content := fmt.Sprintf(`
    <h2 style="color:#1a1a2e;font-size:20px;margin-bottom:16px;">Hi %s,</h2>
    <p style="color:#555;line-height:1.6;margin-bottom:24px;">
      Thank you for signing up for Tiny CRM! Please verify your email address to get started.
    </p>
    <div style="text-align:center;margin:32px 0;">
      <a href="%s" style="background:#2499EF;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:16px;display:inline-block;">
        Verify Email Address
      </a>
    </div>
    <p style="color:#888;font-size:13px;margin-top:24px;">
      If you didn't create an account, you can safely ignore this email.
    </p>
    <p style="color:#888;font-size:13px;">
      Or copy this link: <a href="%s" style="color:#2499EF;">%s</a>
    </p>`, name, verificationURL, verificationURL, verificationURL)

	return baseLayout("Verify Your Email", content)
}
