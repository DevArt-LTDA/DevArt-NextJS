import ServerDataFetcher from "./serverFetcher";

export default function TransApiPage() {
  return (
    <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "20px" }}>Historial de Transacciones Transbank</h1>
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
