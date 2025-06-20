import { getMac } from 'macaddress-local-machine';

export default async function handler(req, res) {
  try {
    // Get the MAC address of the local machine (server)
    const mac = await getMac();
    res.status(200).json({ mac });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}