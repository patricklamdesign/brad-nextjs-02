import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Metadata } from 'next';
import CredentialsSignInForm from './credentials-signin-form';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Sign In',
};

const SignInPage = async (props: {searchParams: Promise<{callbackUrl: string }>}) => {
  const { callbackUrl } = await props.searchParams;             // get callbackUrl from searchParams, tryed to sign in 
  const session = await auth();                                 // check if user is already signed in
  if (session) return redirect(callbackUrl || '/')              // if user is signed in, redirect to callbackUrl or home page

  return (
    <div className='w-full max-w-md mx-auto'>
      <Card className='mt-20'>
        <CardHeader className='space-y-4'>
          <CardTitle className='text-center'>Sign In</CardTitle>
          <CardDescription className='text-center'>
            Sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <CredentialsSignInForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default SignInPage;
