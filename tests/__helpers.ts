import {join} from 'path'
import {execSync} from 'child_process'
import {db} from '../api/db'

export async function initializeDatabase() {
  // Run migrations to initialize the database schema
  const prismaBinary = join(__dirname, '..', 'node_modules', '.bin', 'prisma')
  execSync(`${prismaBinary} db push`)
}

export async function resetDatabase() {
  // Clear the database after the tests
  await db.$executeRaw`DROP SCHEMA IF EXISTS nexus_tutorial CASCADE`
  // Release the Prisma Client connection
  await db.$disconnect()
  return
}
