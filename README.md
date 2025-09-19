# MindConnect Password Reset App

Minimal React + Vite app wired to Supabase to handle password reset via magic link.

## Development

1. Copy `.env.example` to `.env.local` and fill in values:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

2. Run locally:

```
npm install
npm run dev
```

## Environment variables

Set the same keys in Vercel Project Settings → Environment Variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Password recovery flow

- When the user clicks the email link from Supabase (`type=recovery`), the UI skips the email step and shows the Change Password form immediately.
- The redirect URL in `resetPasswordForEmail` is `${window.location.origin}/` so it works in local and production.
- In Supabase Dashboard → Authentication → URL Configuration, add your Vercel URL as Site URL and in Additional Redirect URLs, e.g. `https://your-project.vercel.app/`.

## Deploying to Vercel

1. Import repo into Vercel (Framework preset: Vite).
2. Build command: `vite build`; Output directory: `dist` (auto-detected).
3. Add env vars `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel.
4. Add your Vercel URL in Supabase Auth settings as allowed redirect URL.
