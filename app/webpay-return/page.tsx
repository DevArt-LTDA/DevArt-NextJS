'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function WebpayReturnPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Procesando tu transacción...');
  const [transactionData, setTransactionData] = useState<any>(null);

  useEffect(() => {
    const confirmTransaction = async () => {
      try {
        const token = searchParams.get('token_ws');
        
        if (!token) {
          setStatus('error');
          setMessage('❌ Token de transacción no encontrado');
          return;
        }

        // Confirmar transacción
        const response = await fetch('/api/transbank/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token_ws: token }),
        });

        const data = await response.json();
        setTransactionData(data);

        if (data.success) {
          setStatus('success');
          setMessage(`✅ ${data.message} - Código: ${data.authorizationCode}`);
        } else {
          setStatus('error');
          setMessage(`❌ ${data.message}`);
        }
      } catch (error) {
        setStatus('error');
        setMessage(`❌ Error al procesar: ${(error as any).message}`);
      }
    };

    confirmTransaction();
  }, [searchParams]);

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Transacción Transbank</h1>

      <div style={{
        padding: '20px',
        borderRadius: '8px',
        backgroundColor: status === 'success' ? '#d4edda' : status === 'error' ? '#f8d7da' : '#e7f3ff',
        border: `1px solid ${status === 'success' ? '#28a745' : status === 'error' ? '#dc3545' : '#0066cc'}`,
        marginBottom: '20px',
        minHeight: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ textAlign: 'center' }}>
          {status === 'loading' && (
            <>
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>⏳</div>
              <p>{message}</p>
            </>
          )}
          {status === 'success' && (
            <>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>✅</div>
              <p style={{ fontSize: '18px', color: '#155724' }}>{message}</p>
            </>
          )}
          {status === 'error' && (
            <>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>❌</div>
              <p style={{ fontSize: '18px', color: '#721c24' }}>{message}</p>
            </>
          )}
        </div>
      </div>

      {transactionData && (
        <div style={{
          backgroundColor: '#f9f9f9',
          border: '1px solid #ddd',
          borderRadius: '4px',
          padding: '15px',
          marginBottom: '20px',
        }}>
          <h3>Detalles de la Transacción:</h3>
          <dl>
            <dt><strong>Estado:</strong></dt>
            <dd>{transactionData.success ? 'Aprobada' : 'Rechazada'}</dd>
            
            <dt><strong>Monto:</strong></dt>
            <dd>${transactionData.amount?.toLocaleString('es-CL') || 'N/A'}</dd>
            
            {transactionData.authorizationCode && (
              <>
                <dt><strong>Código de Autorización:</strong></dt>
                <dd><code>{transactionData.authorizationCode}</code></dd>
              </>
            )}
          </dl>
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <Link href="/transbank-test">
          <button style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: '#0066cc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}>
            🔄 Nueva Transacción
          </button>
        </Link>

        <Link href="/Trans-api">
          <button style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: '#6f42c1',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}>
            📊 Ver Historial
          </button>
        </Link>

        <Link href="/">
          <button style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}>
            🏠 Inicio
          </button>
        </Link>
      </div>
    </div>
  );
}
