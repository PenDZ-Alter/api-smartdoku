import { db, DispLanjutan, Disposisi, Status, AksesArsip } from '../utils/db.server';
import type { DataSurat, DataSuratDisposisi, DisposisiItem, SuratKeluar } from '../utils/types';

/* Surat Masuk */
export const listSuratMasuk = async (): Promise<DataSurat[]> => {
  return db.dataSurat.findMany(
    {
      select: {
        id: true,
        nomor_urut: true,
        nama_surat: true,
        tanggal_diterima: true,
        tanggal_surat: true,
        kode: true,
        no_agenda: true,
        no_surat: true,
        hal: true,
        tanggal_waktu: true,
        tempat: true,
        disposisi: true,
        index: true,
        pengolah: true,
        sifat: true,
        link_scan: true,
        disp_1: true,
        disp_2: true,
        disp_3: true,
        disp_4 : true,
        disp_1_notes: true,
        disp_2_notes: true,
        disp_3_notes: true,
        disp_4_notes: true,
        disp_lanjut: true,
        tindak_lanjut_1: true,
        tindak_lanjut_2: true,
        tl_notes_1: true,
        tl_notes_2: true,
        status: true,
        timestamp: true
      }
    }
  );
}

export const getSuratMasuk = async (nomor_urut: number): Promise<DataSurat|null> => {
  return db.dataSurat.findUnique({
    where: { nomor_urut }
  });
}

export const createSuratMasuk = async (
  nama_surat: string,
  tanggal_diterima: Date,
  tanggal_surat: Date,
  kode: string,
  no_agenda: string,
  no_surat: string,
  hal: string,
  tanggal_waktu: Date,
  tempat: string,
  disposisi: DataSuratDisposisi,
  index: string | null,
  pengolah: string,
  sifat: string | null,
  link_scan: string | null,
  disp_1: Date,
  disp_2: Date,
  disp_3: Date | null,
  disp_4 : Date | null,
  disp_1_notes: string | null,
  disp_2_notes: string | null,
  disp_3_notes: string | null,
  disp_4_notes: string | null,
  disp_lanjut: DispLanjutan | null,
  tindak_lanjut_1: Date | null,
  tindak_lanjut_2: Date | null,
  tl_notes_1: string | null,
  tl_notes_2: string | null,
  status: Status | null,
  timestamp: Date
): Promise<DataSurat> => {
  return db.dataSurat.create({
    data: {
      nama_surat,
      tanggal_diterima,
      tanggal_surat,
      kode,
      no_agenda,
      no_surat,
      hal,
      tanggal_waktu,
      tempat,
      disposisi: JSON.parse(JSON.stringify(disposisi)),
      index,
      pengolah,
      sifat,
      link_scan,
      disp_1,
      disp_2,
      disp_3,
      disp_4 ,
      disp_1_notes,
      disp_2_notes,
      disp_3_notes,
      disp_4_notes,
      disp_lanjut,
      tindak_lanjut_1,
      tindak_lanjut_2,
      tl_notes_1,
      tl_notes_2,
      status,
      timestamp
    }
  });
}

export const updateSuratMasuk = async (
  nomor_urut: number,
  nama_surat: string,
  tanggal_diterima: Date,
  tanggal_surat: Date,
  kode: string,
  no_agenda: string,
  no_surat: string,
  hal: string,
  tanggal_waktu: Date,
  tempat: string,
  disposisi: DataSuratDisposisi,
  index: string | null,
  pengolah: string,
  sifat: string | null,
  link_scan: string | null,
  disp_1: Date,
  disp_2: Date,
  disp_3: Date | null,
  disp_4 : Date | null,
  disp_1_notes: string | null,
  disp_2_notes: string | null,
  disp_3_notes: string | null,
  disp_4_notes: string | null,
  disp_lanjut: DispLanjutan | null,
  tindak_lanjut_1: Date | null,
  tindak_lanjut_2: Date | null,
  tl_notes_1: string | null,
  tl_notes_2: string | null,
  status: Status | null,
  timestamp: Date
): Promise<DataSurat> => {
  return db.dataSurat.update({
    where: { nomor_urut },
    data: {
      nama_surat,
      tanggal_diterima,
      tanggal_surat,
      kode,
      no_agenda,
      no_surat,
      hal,
      tanggal_waktu,
      tempat,
      disposisi: JSON.parse(JSON.stringify(disposisi)),
      index,
      pengolah,
      sifat,
      link_scan,
      disp_1,
      disp_2,
      disp_3,
      disp_4 ,
      disp_1_notes,
      disp_2_notes,
      disp_3_notes,
      disp_4_notes,
      disp_lanjut,
      tindak_lanjut_1,
      tindak_lanjut_2,
      tl_notes_1,
      tl_notes_2,
      status,
      timestamp
    }
  });
}

export const deleteSuratMasuk = async (nomor_urut: number): Promise<DataSurat|null> => {
  return db.dataSurat.delete({
    where: { nomor_urut }
  })
}

/* Surat Keluar */
export const listSuratKeluar = async() : Promise<SuratKeluar[]> => {
  return db.suratKeluar.findMany({
    select: {
      id: true,
      nomor_urut: true,
      kode: true,
      klasifikasi: true,
      no_register: true,
      tujuan_surat: true,
      perihal: true,
      tanggal_surat: true,
      akses_arsip: true,
      pengolah: true,
      pembuat: true,
      catatan: true,
      link_surat: true,
      koreksi_1: true,
      koreksi_2: true,
      status: true,
      dok_final: true,
      dok_dikirim: true,
      tanda_terima: true,
      timestamp: true
    }
  });
}

export const getSuratKeluar = async(nomor_urut: number) : Promise<SuratKeluar|null> => {
  return db.suratKeluar.findUnique({ 
    where: { nomor_urut }
  });
}

export const createSuratKeluar = async(
  kode: string,
  klasifikasi: string,
  no_register: string,
  tujuan_surat: string | null,
  perihal: string,
  tanggal_surat: Date,
  akses_arsip: AksesArsip,
  pengolah: Disposisi,
  pembuat: string | null,
  catatan: string | null,
  link_surat: string | null,
  koreksi_1: string | null,
  koreksi_2: string | null,
  status: Status | null,
  dok_final: string | null,
  dok_dikirim: Date | null,
  tanda_terima: Date | null,
  timestamp: Date
) : Promise<SuratKeluar|null> => {
  return db.suratKeluar.create({
    data: {
      kode,
      klasifikasi,
      no_register,
      tujuan_surat,
      perihal,
      tanggal_surat,
      akses_arsip,
      pengolah,
      pembuat,
      catatan,
      link_surat,
      koreksi_1,
      koreksi_2,
      status,
      dok_final,
      dok_dikirim,
      tanda_terima,
      timestamp
    }
  });
}

export const updateSuratKeluar = async(
  nomor_urut: number,
  kode: string,
  klasifikasi: string,
  no_register: string,
  tujuan_surat: string | null,
  perihal: string,
  tanggal_surat: Date,
  akses_arsip: AksesArsip,
  pengolah: Disposisi,
  pembuat: string | null,
  catatan: string | null,
  link_surat: string | null,
  koreksi_1: string | null,
  koreksi_2: string | null,
  status: Status | null,
  dok_final: string | null,
  dok_dikirim: Date | null,
  tanda_terima: Date | null,
  timestamp: Date
) : Promise<SuratKeluar|null> => {
  return db.suratKeluar.update({
    where: { nomor_urut },
    data: {
      kode,
      klasifikasi,
      no_register,
      tujuan_surat,
      perihal,
      tanggal_surat,
      akses_arsip,
      pengolah,
      pembuat,
      catatan,
      link_surat,
      koreksi_1,
      koreksi_2,
      status,
      dok_final,
      dok_dikirim,
      tanda_terima,
      timestamp
    }
  });
}

export const deleteSuratKeluar = async(nomor_urut: number) : Promise<SuratKeluar|null> => {
  return db.suratKeluar.delete({
    where: { nomor_urut }
  });
}