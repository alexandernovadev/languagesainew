import { useEffect } from "react";
import {
  LecturesPage,
  ExamsPage,
  MyWordsPage,
} from "../routes/lazyRoutes";

// Rutas importantes para preload
const importantRoutes = [
  () => LecturesPage,
  () => ExamsPage,
  () => MyWordsPage,
];

export const RoutePreloader: React.FC = () => {
  useEffect(() => {
    // Preload rutas importantes después de un pequeño delay
    const preloadTimer = setTimeout(() => {
      importantRoutes.forEach((routeLoader) => {
        try {
          routeLoader();
        } catch (error) {
          console.warn("Error preloading route:", error);
        }
      });
    }, 2000); // 2 segundos después de cargar la página

    return () => clearTimeout(preloadTimer);
  }, []);

  return null; // Este componente no renderiza nada
};

export default RoutePreloader; 