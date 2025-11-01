import Image from "next/image";
// import Layout from "/app/layout.tsx";
export default function Cart() {
  return (
    <main className="container">
      <div className="TituloHome">
        <h1>Bienvenidos a DevArt</h1>
        <p>Tu espacio para el arte y el desarrollo.</p>
      </div>

      <div className="Carrusel">
        <div className="carousel-item">
          {/* <Image src={bigdata} alt="DevArt Image 1" priority /> */}
          <div className="caption">Servicio de BIGDATA</div>
        </div>
        <div className="carousel-item">
          {/* <Image src={webservice} alt="DevArt Image 2" /> */}
          <div className="caption">Desarrollo Web Art-Técnico</div>
        </div>
        <div className="carousel-item">
          {/* <Image src={analisisdata} alt="DevArt Image 3" /> */}
          <div className="caption">Analisis de Datos</div>
        </div>
      </div>
    </main>
  );
}
