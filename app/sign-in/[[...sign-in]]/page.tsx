import { SignIn } from '@clerk/nextjs'

export const metadata = { title: 'Admin sign in', robots: { index: false, follow: false } }

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <SignIn forceRedirectUrl="/admin" signUpUrl={undefined} />
    </div>
  )
}
