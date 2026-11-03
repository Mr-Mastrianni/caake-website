# C.A.A.K.E. Business OS (admin only)

Private dashboard at `/admin`, built from the "3 skills" idea: shared business memory + three agents.

| Agent | What it does | Where you see it |
|---|---|---|
| **Instant Responder** | Every contact / book-call submission is stored as a lead and gets a drafted, specific reply with the booking link. | Approvals |
| **Lead Finder** | Web-searches public posts for people who need what you sell now, scores them, drafts a first message each. | Leads + Approvals |
| **Retention** | Drafts check-ins for clients who have gone quiet (default 30 days). Marking a lead "won" creates the client. | Clients + Approvals |

**Nothing is sent automatically.** Every message is a draft until an admin approves it.
Fill in **Memory** first: agents only quote prices/facts that are written there.

## Security model
- `middleware.ts` requires a Clerk session on `/admin/*` and `/api/admin/*`.
- A session is NOT enough. `lib/admin-auth.ts` checks the user has a **verified** email in `ADMIN_EMAILS`
  on every admin page and every admin API route. Unset/empty `ADMIN_EMAILS` means nobody is admin.
- Non-admins and signed-out API callers get a plain 404.
- In the Clerk dashboard also turn on **Restricted** sign-up mode (Configure > Restrictions) and invite only yourself.
- Public `/api/lead` has a honeypot, validation, size limits and a best-effort rate limit. Add a Vercel Firewall rate limit for stronger protection.
- Inbound text is passed to the model as untrusted data, and a human approves every outbound message.

## Setup
1. Create a Clerk app, copy keys. Enable Restricted sign-ups, add your email.
2. Add a Neon Postgres database (Vercel Marketplace) for `DATABASE_URL`. Tables auto-create on first use.
3. Add an Anthropic API key.
4. Set the variables in `.env.example` in Vercel (Project > Settings > Environment Variables).
5. Deploy the site to Vercel and point caake.org at it. (The old static GitHub Pages export no longer applies:
   `next.config.js` no longer uses `output: 'export'`. Disable `.github/workflows/nextjs.yml` when you switch.)
6. Open `/sign-in`, then `/admin`. Fill in Memory, then run Lead Finder.

## Notes
- Lead Finder uses Claude's web search over public sources. It does not scrape logged-in platforms or guess emails;
  prospects found this way have a source link instead of an email, so outreach is copy-and-send.
- Email sending is optional (Resend). Without it, "Approve" marks the draft approved and you send it yourself.
- Local dev: copy `.env.example` to `.env.local`, then `npm run dev`.
