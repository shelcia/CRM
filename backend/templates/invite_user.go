package templates

import "fmt"

func InviteUserEmail(name, email, tempPassword string) string {
	content := fmt.Sprintf(`
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
    </p>`, name, email, tempPassword)

	return baseLayout("You're Invited to Tiny CRM", content)
}
