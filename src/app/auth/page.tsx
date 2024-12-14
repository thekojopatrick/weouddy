import { AuthForm } from './components/auth-form';

export default function AuthPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
        <AuthForm />
      </div>
    </div>
  );
}