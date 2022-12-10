import {GetMapRotations,UseNintendoRotation} from '../../utils/fetcher';

export default async function handler(req, res) {
  UseNintendoRotation(false)
  const rotation = await GetMapRotations()
  res.status(200).json({ rotation: rotation })
}
