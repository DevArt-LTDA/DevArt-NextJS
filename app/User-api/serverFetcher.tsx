"use server";

type Usuario = {
  id: number;
  rut: string;
  primerNombre: string;
  segundoNombre: string;
  primApellido: string;
  segApellido: string;
  telefono: string;
  correo: string;
  fechaNacimiento: string;
  rol: string;
  departamento: string;
  cargo: string;
};

export default async function ServerDataFetcher() {
  const api_url = "https://microserviciousuarios-production.up.railway.app/api/v1/usuarios";

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
          <h3>Error al conectar con el microservicio Usuarios</h3>
          <p>Status: {response.status} - {response.statusText}</p>
          <p>URL: {api_url}</p>
          <p>Verifica que el microservicio esté ejecutándose y acepte peticiones GET</p>
        </div>
      );
    }

    const data = await response.json();
    const usuarios = data._embedded.usuariosList;
    console.log("Datos de usuarios obtenidos:", usuarios);

    if (!usuarios || usuarios.length === 0) {
      return <div style={{ padding: "20px" }}>No hay usuarios disponibles</div>;
    }

    return (
      <ul style={{ listStyle: "none", padding: "20px" }}>
        {usuarios.map((item: Usuario, idx: number) => (
          <li key={item.id ?? item.rut ?? idx} style={{ 
            marginBottom: "15px", 
            padding: "15px", 
            border: "1px solid #e0e0e0",
            borderRadius: "5px",
            backgroundColor: "white"
          }}>
            <div><strong>Rut:</strong> {item.rut}</div>
            <div><strong>Primer Nombre:</strong> {item.primerNombre}</div>
            <div><strong>Segundo Nombre:</strong> {item.segundoNombre}</div>
            <div><strong>Primer Apellido:</strong> {item.primApellido}</div>
            <div><strong>Segundo Apellido:</strong> {item.segApellido}</div>
            <div><strong>Teléfono:</strong> {item.telefono || 'N/A'}</div>
            <div><strong>Correo:</strong> {item.correo}</div>
            <div><strong>Fecha de Nacimiento:</strong> {item.fechaNacimiento}</div>
            <div><strong>Rol:</strong> {item.rol}</div>
            <div><strong>Departamento:</strong> {item.departamento}</div>
            <div><strong>Cargo:</strong> {item.cargo}</div>
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
        <p>Asegúrate de que el microservicio esté ejecutándose y acepte peticiones GET</p>
      </div>
    );
  }
}
