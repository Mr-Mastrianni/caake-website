import 'server-only'
import { auth, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { notFound } from 'next/navigation'

export type AdminUser = { userId: string; email: string }

function allowList(): string[] {
  return (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
}

/**
 * Returns the admin user, or null. Fails closed:
 * - no session            -> null
 * - ADMIN_EMAILS unset    -> null (nobody is admin)
 * - email not verified or not on the allow-list -> null
 */
export async function getAdmin(): Promise<AdminUser | null> {
  const allowed = allowList()
  if (allowed.length === 0) return null

  const { userId } = await auth()
  if (!userId) return null

  const user = await currentUser()
  if (!user) return null

  const match = user.emailAddresses.find(
    (e) => e.verification?.status === 'verified' && allowed.includes(e.emailAddress.toLowerCase())
  )
  return match ? { userId, email: match.emailAddress } : null
}

/** For route handlers: returns { admin } or { response } (404 so the API's existence isn't revealed). */
export async function requireAdminApi(): Promise<
  { admin: AdminUser; response?: undefined } | { admin?: undefined; response: NextResponse }
> {
  const admin = await getAdmin()
  if (!admin) return { response: NextResponse.json({ error: 'Not found' }, { status: 404 }) }
  return { admin }
}

/** For server pages/layouts: every admin page calls this itself (a layout check alone is not enough,
 *  since a page's data can be requested independently of its layout). Non-admins get a 404. */
export async function requireAdminPage(): Promise<AdminUser> {
  const admin = await getAdmin()
  if (!admin) notFound()
  return admin
}
