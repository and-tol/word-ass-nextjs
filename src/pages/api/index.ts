// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { phraseResolver } from '../../util/api'

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { query } = req.body as { query: string }

    try {
        const phrase = await phraseResolver(query)
        res.json(phrase)
    } catch (error) {
        res.status(404).json({ error: (error as Error).message });
    }
}
