import ServerDataFetcher from "./serverFetcher";

export default function UserApiPage() {
  return (
    <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "20px" }}>Usuarios desde el repositorio MicroSVUsuario</h1>
      <div style={{ 
        border: "1px solid #ddd", 
        borderRadius: "8px", 
        padding: "20px",
        backgroundColor: "#f9f9f9"
      }}>
        <ServerDataFetcher />
      </div>
    </div>
  );
}
