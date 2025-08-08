import { db } from '../utils/db.server';
import type { Setting } from '../utils/types';

export const listSettings = async() : Promise<Setting[]> => {
  return db.globalSettings.findMany({
    select: {
      suffix_code: true,
      updatedAt: true
    }
  });
}

export const getSetting = async(id: number): Promise<Setting | null> => {
  return db.globalSettings.findUnique({
    where: { id },
    select: {
      suffix_code: true,
      updatedAt: true
    }
  });
}

export const addSetting = async(suffix_code: string): Promise<Setting | null> => {
  const date = Date.now().toString();
  
  return db.globalSettings.create({
    data: {
      suffix_code,
      updatedAt: date
    }
  });
}

export const updateSetting = async(id: number, suffix_code: string): Promise<Setting | null> => {
  const date = Date.now().toString();
  
  return db.globalSettings.update({
    where: { id },
    data: {
      suffix_code,
      updatedAt: date
    }
  });
}

export const deleteSetting = async(id: number): Promise<Setting | null> => {
  return db.globalSettings.delete({
    where: { id }
  });
}