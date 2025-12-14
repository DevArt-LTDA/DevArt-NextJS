'use server';

import { promises as fs } from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'transactions.json');

// Asegurar que el directorio existe
async function ensureDbDirectory() {
  try {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  } catch (error) {
    console.error('Error creando directorio:', error);
  }
}

// Leer transacciones
async function readTransactions() {
  try {
    await ensureDbDirectory();
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Guardar transacciones
async function writeTransactions(transactions: Array<Record<string, unknown>>) {
  try {
    await ensureDbDirectory();
    await fs.writeFile(DB_PATH, JSON.stringify(transactions, null, 2));
  } catch (error) {
    console.error('Error guardando transacciones:', error);
    throw error;
  }
}

// GET - Obtener todas las transacciones
export async function GET() {
  try {
    const transactions = await readTransactions();
    return Response.json({ 
      success: true, 
      data: transactions,
      count: transactions.length 
    });
  } catch {
    return Response.json(
      { success: false, error: 'Error al leer transacciones' },
      { status: 500 }
    );
  }
}

// POST - Guardar nueva transacción
export async function POST(request: Request) {
  try {
    const transactionData = await request.json();
    const transactions = await readTransactions();
    
    const newTransaction = {
      id: Date.now(),
      ...transactionData,
      createdAt: new Date().toISOString(),
    };
    
    transactions.push(newTransaction);
    await writeTransactions(transactions);
    
    return Response.json(
      { success: true, data: newTransaction },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error guardando transacción:', error);
    return Response.json(
      { success: false, error: 'Error al guardar transacción' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar transacción
export async function PUT(request: Request) {
  try {
    const { token, ...updateData } = await request.json();
    const transactions = await readTransactions();
    
    const index = transactions.findIndex((t: { token?: string }) => t.token === token);
    if (index === -1) {
      return Response.json(
        { success: false, error: 'Transacción no encontrada' },
        { status: 404 }
      );
    }
    
    transactions[index] = {
      ...transactions[index],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };
    
    await writeTransactions(transactions);
    
    return Response.json({ success: true, data: transactions[index] });
  } catch (error) {
    console.error('Error actualizando transacción:', error);
    return Response.json(
      { success: false, error: 'Error al actualizar transacción' },
      { status: 500 }
    );
  }
}
