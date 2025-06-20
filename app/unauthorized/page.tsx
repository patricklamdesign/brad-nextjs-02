// ch 98

import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: 'Unauthorized',
  description: 'You are not authorized to view this page', 
};

const Unauthorized = () => {
  return (
    <div className='flex flex-col items-center justify-center space-y-4 h-[calc(100vh-200px)]'>
      <h1 className='text-2xl font-bold'>Unauthorized</h1>
      <p className='text-gray-600'>You are not authorized to view this page</p>
      <Button asChild>
        <Link href='/'>
          Go back home
        </Link>
      </Button>
    </div>
  )
}

export default Unauthorized;

