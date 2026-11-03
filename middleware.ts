import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// First layer of defense: require a Clerk session for admin pages and admin APIs.
// The real authorization (admin email allow-list) is enforced server-side by
// requireAdmin()/getAdmin() in lib/admin-auth.ts, because Clerk lets anyone sign up
// unless restricted, and a session alone must never equal "admin".
const isProtected = createRouteMatcher(['/admin(.*)', '/api/admin(.*)'])

export default clerkMiddleware(async (auth, req) => {
  if (isProtected(req)) {
    await auth.protect()
  }
})

// Only run on admin/auth routes so the public marketing site never depends on Clerk.
export const config = {
  matcher: ['/admin(.*)', '/api/admin(.*)', '/sign-in(.*)'],
}
