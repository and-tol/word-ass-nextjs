// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { phraseResolver } from '../../util/api'

type SlugType = { slug: string }

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { slug } = req.query as SlugType

    try {
        const phrase = await phraseResolver(slug)
        res.json({phrase})
    } catch (error) {
        res.status(400).json({ error: (error as Error).message })
    }
} 
