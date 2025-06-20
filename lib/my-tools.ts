import { auth } from '@/auth';
import macAddr from "macaddress-local-machine";
import { getUserById } from '@/actions/user';

export const compareMacAddress = async() => {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error('User ID not found');
  const user = await getUserById(userId)
  const macAddress = macAddr.first();
  if (macAddress.macAddr == '') macAddress.macAddr = '000'
  if (user.currentToken === macAddress.macAddr) {
    return {
      success: true,
      databaseAddress: user.currentToken,
      machineAddress: macAddress.macAddr
    }
  } else {
     return {
      success: false,
      databaseAddress: user.currentToken,
      machineAddress: macAddress.macAddr
    }
  }
}