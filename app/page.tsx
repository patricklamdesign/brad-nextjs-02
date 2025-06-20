import Link from "next/link";
import { signOutUser } from '@/actions/user';
import { Button } from '@/components/ui/button';


export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
          <Link href='/sign-in' className='text-3xl'>Login</Link>
          <Link href='/sign-up' className='text-3xl'>Add users</Link>
          <Link href='/project/case' className='text-3xl'>Go to Project</Link>
          <form action={signOutUser} className='w-full'>
            <Button className='w-full py-4 px-2 h-4 justify-start text-3xl' variant='ghost'>Sign Out</Button>
          </form>
      </main>
    </div>
  );
}
