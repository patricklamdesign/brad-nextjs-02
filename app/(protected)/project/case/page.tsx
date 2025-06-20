import { auth } from '@/auth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { compareMacAddress } from '@/lib/my-tools';

declare module "next-auth" {
  interface User {
    currentToken?: string;
  }
}

const ProjectCasePage = async() => {
  const session = await auth();
  const currentMachine = await compareMacAddress()
  // if (!currentMachine.success) redirect('/unauthorized');

  return ( 
    <div className='text-2xl'>
      <p>Project case page</p>
      <p>--</p>
      <p>User ID from session:  {session?.user?.id}</p>
      <p>User Name from session:  {session?.user?.name}</p>
      <p>Current token from session :  {session?.user?.currentToken}</p>
      <p>Current token from DataBase :  {currentMachine.databaseAddress}</p>
      <p>Current token from Machine : {currentMachine.machineAddress} </p>
      <Link href='/'><Button variant='outline'>Return to first Page</Button></Link>
    </div>
   );
}
 
export default ProjectCasePage;