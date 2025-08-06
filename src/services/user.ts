import bcrypt from 'bcrypt';
import { db } from '../utils/db.server';
import type { Disposisi, Role } from '../utils/db.server';
import type { User } from '../utils/types';

export const listUsers = async() : Promise<User[]> => {
  return db.user.findMany({
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      bidang: true,
      password: false,
      role: false,
      address: true,
      phone_number: true
    }
  });
}

export const getUser = async(id: string|undefined) : Promise<User | null> => {
  return db.user.findUnique({
    where: { id }
  });
}

export const updateUser = async(
  id: string|undefined,
  email: string,
  name: string,
  username: string,
  bidang: Disposisi | null,
  role: Role,
  address: string | null,
  phone_number: string | null
) : Promise<User | null> => {
  return db.user.update({ 
    where: { id },
    data : {
      name,
      username,
      email,
      bidang,
      role,
      address,
      phone_number
    }
  });
}

export const deleteUser = async(id: string|undefined) : Promise<User> => {
  return db.user.delete({
    where: { id }
  });
}

export const changePassword = async(id: string|undefined, password: string) : Promise<User> => {
  const hashed = await bcrypt.hash(password, 10);
  
  return db.user.update({
    where: { id },
    data: { password: hashed }
  });
}