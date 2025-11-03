import Image from "next/image";
import bigdata from "./img/ChatGPTbigdata.png";
import devweb from "./img/ChatGPTdevweb.png";
import analisis from "./img/ChatGPTanalisisdata.png";

export default function Page() {
  return (
    <main className="container">
      <div className="TituloHome">
        <h1>Bienvenidos a DevArt</h1>
        <p>Tu espacio para el arte y el desarrollo.</p>
      </div>

      <div className="Carrusel">
        <div className="carousel-item">
          <Image
            src={bigdata}
            alt="Servicio de BIGDATA"
            width={800}
            height={450}
            priority
          />
          <div className="caption">Servicio de BIGDATA</div>
        </div>

        <div className="carousel-item">
          <Image
            src={devweb}
            alt="Desarrollo Web Art-Técnico"
            width={800}
            height={450}
          />
          <div className="caption">Desarrollo Web Art-Técnico</div>
        </div>

        <div className="carousel-item">
          <Image
            src={analisis}
            alt="Análisis de Datos"
            width={800}
            height={450}
          />
          <div className="caption">Análisis de Datos</div>
        </div>
      </div>
    </main>
  );
}
