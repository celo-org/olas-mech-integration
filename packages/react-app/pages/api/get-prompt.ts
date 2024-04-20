// pages/api/get-prompt.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const prompt = req.query.prompt; // Access the prompt sent from the frontend
  try {
    const { data } = await axios.get(`http://127.0.0.1:5000/get-prompt?prompt=${prompt}`);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
