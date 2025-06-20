import { Metadata } from 'next';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import SignUpForm from './signup-form';

export const metadata: Metadata = { title: 'Sign Up' }

const SignUpPage = async (props: {searchParams: Promise<{callbackUrl: string }>}) => {
  const searchParams = await props.searchParams;
  const { callbackUrl } = searchParams;
  const session = await auth();
  if (session) return redirect(callbackUrl || '/');

  return (
    <div className='w-full max-w-md mx-auto'>
      <Card className='mt-20'>
        <CardHeader className='space-y-4'>
          <CardTitle className='text-center'>Create Account</CardTitle>
          <CardDescription className='text-center'>Enter your information below to create your account</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <SignUpForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUpPage;