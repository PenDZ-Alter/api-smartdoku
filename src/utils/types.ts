import { Bidang, Role } from '../utils/db.server';

export type User = {
  id: number,
  email: string,
  name: string,
  username: string,
  bidang: Bidang,
  password?: string,
  role?: Role,
  address: string | null,
  phone_number: bigint | null
}