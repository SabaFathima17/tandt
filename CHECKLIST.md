# Train & Test — Environment & Security Checklist

## Environment Variables
| Variable | Added to .env.local | Added to Vercel |
|---|---|---|
| NEXT_PUBLIC_SUPABASE_URL | ✅ | ✅ |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | ✅ | ✅ |
| NEXT_PUBLIC_SITE_URL | ✅ | ✅ |
| SENTRY_AUTH_TOKEN | ❌ (not needed locally) | ✅ |
| GEMINI_API_KEY | ⏳ Day 8 | ⏳ Day 8 |
| ANTHROPIC_API_KEY | ⏳ Day 8 | ⏳ Day 8 |
| RAZORPAY_KEY_ID | ⏳ Day 38 | ⏳ Day 38 |
| RAZORPAY_KEY_SECRET | ⏳ Day 38 | ⏳ Day 38 |
| STRIPE_SECRET_KEY | ⏳ Day 39 | ⏳ Day 39 |
| NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY | ⏳ Day 39 | ⏳ Day 39 |
| RESEND_API_KEY | ⏳ Day 38 | ⏳ Day 38 |
| SENTRY_DSN | ⏳ Add after Sentry setup | ⏳ Add after Sentry setup |
| ADMIN_SECRET | ⏳ Day 45 | ⏳ Day 45 |
| GOOGLE_CLIENT_SECRET | ❌ (not needed in .env.local) | ❌ (handled by Supabase) |

## Security Checklist
- [x] RLS enabled on all 8 Supabase tables
- [x] .env.local in .gitignore
- [x] No API keys committed to GitHub
- [x] Supabase anon key safe (RLS protects rows)
- [x] SENTRY_AUTH_TOKEN added to Vercel only

## Supabase Tables
- [x] users
- [x] projects
- [x] step_progress
- [x] payments
- [x] waitlist
- [x] prebuilt_projects (with project_json column)
- [x] beta_users
- [x] rate_limits