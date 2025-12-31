import { promises as fs } from 'fs';
import path from 'path';

export interface Inquiry {
  id: string;
  name: string;
  phone: string;
  message: string;
  createdAt: string;
  status: 'pending' | 'contacted' | 'completed';
}

const DATA_FILE = path.join(process.cwd(), 'data', 'inquiries.json');

async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

async function ensureDataFile() {
  await ensureDataDir();
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2));
  }
}

export async function getInquiries(): Promise<Inquiry[]> {
  await ensureDataFile();
  const data = await fs.readFile(DATA_FILE, 'utf-8');
  return JSON.parse(data);
}

export async function addInquiry(inquiry: Omit<Inquiry, 'id' | 'createdAt' | 'status'>): Promise<Inquiry> {
  await ensureDataFile();
  const inquiries = await getInquiries();

  const newInquiry: Inquiry = {
    ...inquiry,
    id: `INQ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    status: 'pending',
  };

  inquiries.unshift(newInquiry);
  await fs.writeFile(DATA_FILE, JSON.stringify(inquiries, null, 2));

  return newInquiry;
}

export async function updateInquiryStatus(id: string, status: Inquiry['status']): Promise<Inquiry | null> {
  await ensureDataFile();
  const inquiries = await getInquiries();

  const index = inquiries.findIndex((inq) => inq.id === id);
  if (index === -1) return null;

  inquiries[index].status = status;
  await fs.writeFile(DATA_FILE, JSON.stringify(inquiries, null, 2));

  return inquiries[index];
}

export async function deleteInquiry(id: string): Promise<boolean> {
  await ensureDataFile();
  const inquiries = await getInquiries();

  const index = inquiries.findIndex((inq) => inq.id === id);
  if (index === -1) return false;

  inquiries.splice(index, 1);
  await fs.writeFile(DATA_FILE, JSON.stringify(inquiries, null, 2));

  return true;
}
