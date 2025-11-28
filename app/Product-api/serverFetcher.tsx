"use server";

type Catalogo = {
  id: number;
  nombre: string;
  tipo: string;
  descripcion: string;
  precio: number;
  fechaDespliegue: string;
  estadoDesarrollo: string;
};

export default async function ServerDataFetcher() {
  const api_url = "http://localhost:8099/api/v1/catalogo";
  
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
          <h3>Error al conectar con el microservicio</h3>
          <p>Status: {response.status} - {response.statusText}</p>
          <p>URL: {api_url}</p>
          <p>Verifica que el microservicio esté ejecutándose y acepte peticiones GET</p>
        </div>
      );
    }

    const data = await response.json();
    const catalogos = data;

    if (!catalogos || catalogos.length === 0) {
      return <div style={{ padding: "20px" }}>No hay productos disponibles</div>;
    }

    return (
      <ul style={{ listStyle: "none", padding: "20px" }}>
        {catalogos.map((item: Catalogo, idx: number) => (
          <li key={item.id ?? item.nombre ?? idx} style={{ 
            marginBottom: "15px", 
            padding: "15px", 
            border: "1px solid #e0e0e0",
            borderRadius: "5px",
            backgroundColor: "white"
          }}>
            <div><strong>ID:</strong> {item.id}</div>
            <div><strong>Nombre:</strong> {item.nombre}</div>
            <div><strong>Tipo:</strong> {item.tipo}</div>
            <div><strong>Descripción:</strong> {item.descripcion}</div>
            <div><strong>Precio:</strong> ${item.precio?.toLocaleString('es-CL') || 'N/A'}</div>
            <div><strong>Fecha Despliegue:</strong> {item.fechaDespliegue ? new Date(item.fechaDespliegue).toLocaleDateString('es-CL') : 'N/A'}</div>
            <div><strong>Estado Desarrollo:</strong> {item.estadoDesarrollo || 'N/A'}</div>
          </li>
        ))}
      </ul>
    );
    
  } catch (error) {
    return (
      <div style={{ color: "red", padding: "20px" }}>
        <h3>Error de conexión</h3>
        <p>No se pudo conectar con el microservicio en: {api_url}</p>
        <p>Error: {error instanceof Error ? error.message : "Error desconocido"}</p>
        <p>Asegúrate de que el microservicio esté ejecutándose en el puerto 8099</p>
      </div>
    );
  }
}
