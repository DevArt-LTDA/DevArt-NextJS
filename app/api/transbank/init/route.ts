import { WebpayPlus, Options, IntegrationApiKeys, IntegrationCommerceCodes, Environment } from 'transbank-sdk';

// Cliente WebpayPlus en ambiente de integración
const tx = new WebpayPlus.Transaction(
  new Options(IntegrationCommerceCodes.WEBPAY_PLUS, IntegrationApiKeys.WEBPAY, Environment.Integration)
);

export async function POST(request: Request) {
  try {
    const { amount, sessionId, returnUrl } = await request.json();

    if (!amount || !sessionId || !returnUrl) {
      return Response.json(
        { error: 'Faltan parámetros requeridos' },
        { status: 400 }
      );
    }

    // Crear transacción en Transbank
    const response = await tx.create(
      sessionId,  // buyOrder
      sessionId,  // sessionId
      amount,     // amount (CLP)
      returnUrl   // returnURL
    );

    // Guardar datos de la transacción
    const savedTransaction = await saveTransaction({
      sessionId,
      amount,
      buyOrder: sessionId,
      token: response.token,
      url: response.url,
      status: 'INITIATED',
      createdAt: new Date().toISOString(),
    });

    return Response.json({
      token: response.token,
      url: response.url,
      redirectUrl: `${response.url}?token_ws=${response.token}`,
      transactionId: savedTransaction?.id, // Guardar el ID para luego actualizar
    });
  } catch (error) {
    console.error('Error al crear transacción:', error);
    return Response.json(
      { error: 'Error al crear la transacción', details: (error as any).message },
      { status: 500 }
    );
  }
}

// Funci\u00f3n auxiliar para guardar transacciones en microservicio
async function saveTransaction(transactionData: any) {
  try {
    const MICROSERVICE_URL = 'https://microserviciotransacciones-production-9b80.up.railway.app/api/v1/transacciones';
    
    const response = await fetch(MICROSERVICE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        aprobado: false,
        descripcion: `Transacción Transbank - Token: ${transactionData.token.substring(0, 20)}...`,
        fecha: transactionData.createdAt.split('T')[0], // Formato YYYY-MM-DD
        monto: transactionData.amount,
        tipo: 'WEBPAY_PLUS',
        usuarioRut: '694-01-7141' // Campo en camelCase como en la entidad
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.warn('Advertencia al guardar en microservicio:', response.status, errorText);
      return null;
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error al guardar transacci\u00f3n en microservicio:', error);
  }
}
