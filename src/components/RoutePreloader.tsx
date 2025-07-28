import { useEffect } from "react";
import { LecturesPage, ExamsPage, MyWordsPage } from "../routes/lazyRoutes";

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
    }, 200);

    return () => clearTimeout(preloadTimer);
  }, []);

  return null;
};

export default RoutePreloader;
