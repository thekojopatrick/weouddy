import AccountForm from '@/components/account/new-account-form';
import { getSession } from '@/lib/auth';

export default async function Account() {
	const session = await getSession();

	if (!session) {
		return null;
	}

	return <AccountForm user={session.user as never} />;
}
