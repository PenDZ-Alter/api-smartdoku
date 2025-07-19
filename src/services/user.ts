import { db } from '../utils/db.server';
import type { User } from '../utils/types';

export const listUsers = async() : Promise<User[]> => {
  return db.user.findMany({
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      password: false,
      role: false,
      address: true,
      phone_number: true
    }
  });
}

export const getUser = async(id: number) : Promise<User | null> => {
  return db.user.findUnique({
    where: { id }
  });
}

export const deleteUser = async(id: number) : Promise<User> => {
  return db.user.delete({
    where: { id }
  });
}