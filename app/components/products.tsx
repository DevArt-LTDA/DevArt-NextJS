// app/components/products.tsx
import { StaticImageData } from "next/image";
import bigdata from "../img/ChatGPTbigdata.png";
import devweb from "../img/ChatGPTdevweb.png";
import analisis from "../img/ChatGPTanalisisdata.png";

export type Producto = {
  id: number;
  nombre: string;
  precio: number;
  img: StaticImageData;
  descripcion: string;
  features: string[];
};

const productos: Producto[] = [
  {
    id: 1,
    nombre: "Servicio de BIGDATA",
    precio: 50000,
    img: bigdata,
    descripcion:
      "Análisis avanzado de grandes volúmenes de datos para generar insights valiosos.",
    features: ["Análisis Predictivo", "Data Mining", "Visualización"],
  },
  {
    id: 2,
    nombre: "Desarrollo Web Art-Técnico",
    precio: 80000,
    img: devweb,
    descripcion:
      "Sitios modernos y funcionales con diseño artístico y tecnología de vanguardia.",
    features: ["Diseño Moderno", "Responsive", "Optimizado"],
  },
  {
    id: 3,
    nombre: "Análisis de Datos",
    precio: 60000,
    img: analisis,
    descripcion:
      "Convertimos tus datos en información estratégica para decidir mejor.",
    features: ["Diseño Personalizado", "KPI's", "Insights"],
  },
];

export { productos };
