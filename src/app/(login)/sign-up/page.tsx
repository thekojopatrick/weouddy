import { Login } from '../_components/login';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';

export default async function SignUpPage() {
  const user = await getSession();

  if (user) {
    return redirect('/discover');
  }

  return <Login mode="signup" />;
}
