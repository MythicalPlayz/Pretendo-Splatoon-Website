import {GetMapRotations} from '../../utils/fetcher';

export default async function handler(req, res) {
  console.log(req.query)
  const rotation = await GetMapRotations()
  res.status(200).json({ rotation: rotation })
}
