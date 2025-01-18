import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';
import { Message } from '../_components/form-message';

export default async function ForgotPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;

  console.log({ searchParams });

  return (
    <>
      <div className="min-h-[100dvh] bg-gradient-to-b from-white to-gray-50 flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <ForgotPasswordForm />
        </div>
      </div>
    </>
  );
}
