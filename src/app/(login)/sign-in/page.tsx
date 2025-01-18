import { redirect } from 'next/navigation';
import { Login } from '../_components/login';
import { getSession } from '@/lib/auth';

export default async function SignInPage() {
  const user = await getSession();

  if (user) {
    return redirect('/discover');
  }

  return <Login mode="signin" />;
}
