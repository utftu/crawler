// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import Crawler from "../../modules/crawler";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const url = decodeURIComponent(req.query.url)
  const max_depth = Number(req.query.max_depth)
  const max_requests = Number(req.query.max_requests)
  if (!url || max_depth > 4 || max_requests > 40) {
    res.status(418).send('')
    return
  }
  console.log('-----', 'start')
  console.log('-----', 'url, Number(max_depth), Number(max_requests)', url, max_depth, max_requests)
  const results = await Crawler.new(url, Number(max_depth), Number(max_requests)).start()
  console.log('-----', 'end')
  console.log('-----', 'results', results)
  res.json(results)
}
