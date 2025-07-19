import { Role } from '../utils/db.server';

export type User = {
  id: number,
  email: string,
  name: string,
  username: string,
  password?: string,
  role?: Role,
  address: string,
  phone_number: bigint
}