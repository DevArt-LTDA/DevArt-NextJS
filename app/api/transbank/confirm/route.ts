import { WebpayPlus, Options, IntegrationApiKeys, IntegrationCommerceCodes, Environment } from 'transbank-sdk';

// Cliente WebpayPlus en ambiente de integración
const tx = new WebpayPlus.Transaction(
  new Options(IntegrationCommerceCodes.WEBPAY_PLUS, IntegrationApiKeys.WEBPAY, Environment.Integration)
);

export async function POST(request: Request) {
  try {
    const { token_ws } = await request.json();

    if (!token_ws) {
      return Response.json(
        { error: 'Token no proporcionado' },
        { status: 400 }
      );
    }

    // Confirmar transacción
    const response = await tx.commit(token_ws);

    // Actualizar estado de la transacción en base de datos
    await updateTransaction(token_ws, {
      status: response.response_code === 0 ? 'APPROVED' : 'REJECTED',
      responseCode: response.response_code,
      authorizationCode: response.authorization_code,
      cardLastFourDigits: response.card_detail?.card_number?.slice(-4),
      completedAt: new Date().toISOString(),
    });

    return Response.json({
      success: response.response_code === 0,
      message: response.response_code === 0 ? 'Transacción aprobada' : 'Transacción rechazada',
      authorizationCode: response.authorization_code,
      amount: response.amount,
    });
  } catch (error) {
    console.error('Error al confirmar transacción:', error);
    return Response.json(
      { error: 'Error al confirmar la transacción' },
      { status: 500 }
    );
  }
}

async function updateTransaction(token: string, updateData: any) {
  try {
    const MICROSERVICE_URL = 'https://microserviciotransacciones-production-9b80.up.railway.app/api/v1/transacciones';
    
    // Primero obtener todas las transacciones
    const getResponse = await fetch(MICROSERVICE_URL);
    const transactions = await getResponse.json();
    
    // Buscar la transacción que contiene este token en la descripción
    const transaction = transactions.find((t: any) => 
      t.descripcion && t.descripcion.includes(token.substring(0, 20))
    );
    
    if (!transaction) {
      console.warn('No se encontró la transacción con token:', token.substring(0, 20));
      return;
    }
    
    // Actualizar la transacción encontrada
    const response = await fetch(`${MICROSERVICE_URL}/${transaction.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...transaction,
        aprobado: updateData.status === 'APPROVED',
        descripcion: `${transaction.descripcion} - Código: ${updateData.authorizationCode || 'N/A'}`,
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.warn('Advertencia al actualizar en microservicio:', response.status, errorText);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error al actualizar transacción en microservicio:', error);
  }
}
