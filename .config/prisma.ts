import path from 'node:path'
import * as dotenv from 'dotenv'
import { defineConfig } from 'prisma/config'

const NODE = process.env.NODE_ENV?.trim()
if (NODE === 'production') {
  dotenv.config({ path: path.resolve(__dirname, '..', `.env.production`) })
} else {
  dotenv.config({ path: path.resolve(__dirname, '..', `.env.local`) })
}

export default defineConfig({
  schema: path.join('..', 'prisma'),
  migrations: {
    path: path.join('..', 'prisma', 'migrations'),
    seed: 'tsx ../prisma/seed.ts',
  },
})
