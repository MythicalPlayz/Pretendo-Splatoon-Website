import {GetSplatfestData} from '../../utils/fetcher';

export default async function handler(req, res) {
  const splatfest = await GetSplatfestData()
  res.status(200).json({ splatfest: splatfest })
}
