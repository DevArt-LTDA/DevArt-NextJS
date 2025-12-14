'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function TransbankTestPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [transactionData, setTransactionData] = useState<any>(null);

  const handleInitTransaction = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/transbank/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 9990, 
          sessionId: `test_${Date.now()}`,
          returnUrl: `${window.location.origin}/webpay-return`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(`❌ Error: ${data.error || 'Error desconocido'}`);
        return;
      }

      setTransactionData(data);
      setMessage('✅ Transacción iniciada correctamente');
      
      sessionStorage.setItem('transbankToken', data.token);
      
      setTimeout(() => {
        if (data.redirectUrl) {
          window.location.href = data.redirectUrl;
        }
      }, 2000);
    } catch (error) {
      setMessage(`❌ Error de conexión: ${(error as any).message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckTransactions = async () => {
    try {
      const response = await fetch('/api/transbank/save');
      const data = await response.json();
      setTransactionData(data);
      setMessage(`Se encontraron ${data.count || 0} transacciones`);
    } catch (error) {
      setMessage(`Error: ${(error as any).message}`);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Pagina de Prueba - Transbank</h1>
      
      <div style={{
        backgroundColor: '#f0f4f8',
        border: '1px solid #0066cc',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <h2>Información de Prueba</h2>
        <p><strong>RUT:</strong> 11.111.111-1</p>
        <p><strong>Contraseña:</strong> 123456</p>
        <p><strong>Monto de prueba:</strong> $9.990 CLP</p>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button
          onClick={handleInitTransaction}
          disabled={loading}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: '#0066cc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? 'Procesando...' : '💳 Iniciar Transacción'}
        </button>

        <button
          onClick={handleCheckTransactions}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          📊 Ver Transacciones
        </button>

        <Link href="/Trans-api">
          <button
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              backgroundColor: '#6f42c1',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            📈 Historial Completo
          </button>
        </Link>
      </div>

      {message && (
        <div style={{
          padding: '12px',
          backgroundColor: message.includes('✅') ? '#d4edda' : '#f8d7da',
          color: message.includes('✅') ? '#155724' : '#721c24',
          borderRadius: '4px',
          marginBottom: '20px',
        }}>
          {message}
        </div>
      )}

      {transactionData && (
        <div style={{
          backgroundColor: '#f9f9f9',
          border: '1px solid #ddd',
          borderRadius: '4px',
          padding: '15px',
          marginTop: '20px',
        }}>
          <h3>Datos de la Transacción:</h3>
          <pre style={{ fontSize: '12px', overflowX: 'auto' }}>
            {JSON.stringify(transactionData, null, 2)}
          </pre>
        </div>
      )}


    </div>
  );
}
