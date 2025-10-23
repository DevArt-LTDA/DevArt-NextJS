// app/page.tsx
export default function Page() {
  return (
    <main className="container">
      <div className="TituloHome">
        <h1>Bienvenidos a DevArt</h1>
        <p>Tu espacio para el arte y el desarrollo.</p>
      </div>

      <div className="Carrusel">
        <div className="carousel-item">
          <img src="/ChatGPTbigdata.png" alt="DevArt Image 1" />
          <div className="caption">Servicio de BIGDATA</div>
        </div>
        <div className="carousel-item">
          <img src="/ChatGPTdevweb.png" alt="DevArt Image 2" />
          <div className="caption">Desarrollo Web Art-Técnico</div>
        </div>
        <div className="carousel-item">
          <img src="/ChatGPTanalisisdata.png" alt="DevArt Image 3" />
          <div className="caption">Analisis de Datos</div>
        </div>
      </div>
    </main>
  );
}
