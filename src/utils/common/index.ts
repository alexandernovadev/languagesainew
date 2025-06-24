export * from "./string";
export * from "./classnames";
export * from "./time";

/**
 * Descarga datos como archivo JSON
 * @param data - Los datos a descargar
 * @param filename - Nombre del archivo (sin extensión)
 */
export const downloadJSON = (data: any, filename: string) => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}; 