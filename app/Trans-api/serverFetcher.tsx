"use server";

type Transaccion = {
  id: number;
  sessionId: string;
  amount: number;
  token: string;
  url: string;
  status: string;
  responseCode?: string;
  authorizationCode?: string;
  cardLastFourDigits?: string;
  createdAt: string;
  updatedAt?: string;
};

export default async function ServerDataFetcher() {
  const api_url = "https://microserviciotransacciones-production-9b80.up.railway.app/api/v1/transacciones";
  
  try {
    const response = await fetch(api_url, { 
      cache: "no-store",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });

    if (!response.ok) {
      return (
        <div style={{ color: "red", padding: "20px" }}>
          <h3>Error al conectar con el servidor de transacciones</h3>
          <p>Status: {response.status} - {response.statusText}</p>
          <p>URL: {api_url}</p>
          <p>Verifica que la API esté ejecutándose correctamente</p>
        </div>
      );
    }

    const data = await response.json();
    // El microservicio retorna un array directo
    const transacciones = Array.isArray(data) ? data : data._embedded?.transaccionesList || data.data || [];
    console.log("Datos de transacciones obtenidos:", transacciones);

    if (!transacciones || transacciones.length === 0) {
      return <div style={{ padding: "20px" }}>No hay transacciones registradas</div>;
    }

    return (
      <div style={{ padding: "20px" }}>
        <h2 style={{ marginBottom: "20px" }}>Total de transacciones: {transacciones.length}</h2>
        <ul style={{ listStyle: "none", padding: "0" }}>
          {transacciones.map((item: any) => (
            <li key={item.id} style={{ 
              marginBottom: "15px", 
              padding: "15px", 
              border: "1px solid #e0e0e0",
              borderRadius: "5px",
              backgroundColor: item.aprobado ? "#f0f9ff" : "#fff9f0"
            }}>
              <div><strong>ID:</strong> {item.id}</div>
              <div><strong>Monto:</strong> ${(item.monto || 0).toLocaleString('es-CL')}</div>
              <div><strong>Tipo:</strong> {item.tipo}</div>
              <div><strong>Usuario RUT:</strong> {item.usuarioRut}</div>
              <div><strong>Estado:</strong> <span style={{ 
                padding: "4px 8px", 
                borderRadius: "3px",
                backgroundColor: item.aprobado ? '#90EE90' : '#FFB6C6'
              }}>{item.aprobado ? 'APROBADO' : 'PENDIENTE'}</span></div>
              <div><strong>Descripción:</strong> {item.descripcion}</div>
              <div><strong>Fecha:</strong> {new Date(item.fecha).toLocaleString('es-CL')}</div>
            </li>
          ))}
        </ul>
      </div>
    );
    
  } catch (error) {
    return (
      <div style={{ color: "red", padding: "20px" }}>
        <h3>Error de conexión</h3>
        <p>No se pudo conectar con la API en: {api_url}</p>
        <p>Error: {error instanceof Error ? error.message : "Error desconocido"}</p>
        <p>Asegúrate de que el servidor está ejecutándose</p>
      </div>
    );
  }
}
