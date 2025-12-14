'use client';

import { useState } from 'react';

export default function TransbankPaymentForm() {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const sessionId = `session_${Date.now()}`;
      const returnUrl = `${window.location.origin}/cart`;

      const response = await fetch('/api/transbank/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseInt(amount),
          sessionId,
          returnUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Error al iniciar transacción');
        return;
      }

      setSuccess('Redirigiendo a Transbank...');
      
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      }
    } catch (err) {
      setError('Error al procesar el pago');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', padding: '20px' }}>
      <h2>Pagar con Transbank</h2>
      
      <form onSubmit={handlePayment} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label htmlFor="amount">Monto a pagar (CLP):</label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Ej: 50000"
            required
            style={{
              width: '100%',
              padding: '10px',
              marginTop: '5px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontSize: '16px',
            }}
          />
        </div>

        {error && (
          <div style={{ padding: '10px', backgroundColor: '#fee', color: '#c00', borderRadius: '4px' }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ padding: '10px', backgroundColor: '#efe', color: '#060', borderRadius: '4px' }}>
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !amount}
          style={{
            padding: '12px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Procesando...' : 'Pagar'}
        </button>
      </form>

      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
        <h3>Credenciales de Prueba:</h3>
        <p><strong>RUT:</strong> 11.111.111-1</p>
        <p><strong>Contraseña:</strong> 123456</p>
        <p><small>Estas son las credenciales para el ambiente de pruebas de Transbank</small></p>
      </div>
    </div>
  );
}
