import { db } from '../utils/db.server'

export async function getRecentLogs(limit = 100) {
  return db.log.findMany({
    orderBy: { id: 'desc' },
    take: limit,
  })
}
