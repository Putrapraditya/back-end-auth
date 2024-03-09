import { Schema, model, Document } from 'mongoose';

export interface DataDiri extends Document {
  iduser: string;
  namaLengkap: string;
  tempatLahir: string;
  tanggalLahir: Date;
  jenisKelamin: 'LK' | 'P';
  noTelp: string;
  namaJalan: string;
  kota: string;
  kel: string;
  rt: string;
  rw: string;
  kodePos: string;
  namaPerusahaan?: string;
  noTelpPerusahaan?: string;
  alamatPerusahaan?: string;
}

const DataDiriSchema: Schema = new Schema({ 
  iduser: { type: String, required: true },
  namaLengkap: { type: String, required: true },
  tempatLahir: { type: String, required: true },
  tanggalLahir: { type: Date, required: true },
  jenisKelamin: { type: String, enum: ['LK', 'P'], required: true },
  noTelp: { type: String, required: true },
  namaJalan: { type: String, required: true },
  kota: { type: String, required: true },
  kel: { type: String, required: true },
  rt: { type: String, required: true },
  rw: { type: String, required: true },
  kodePos: { type: String, required: true },
  namaPerusahaan: { type: String, required: true },
  noTelpPerusahaan: { type: String, required: true },
  alamatPerusahaan: { type: String, required: true },
});

export default model<DataDiri>('DataDiri', DataDiriSchema);