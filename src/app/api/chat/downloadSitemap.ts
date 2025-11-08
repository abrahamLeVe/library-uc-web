export async function readSitemapFromURL(url: string): Promise<string> {
  try {
    // --- Solución de Caché del Fetch ---
    // Añadimos { cache: "no-store" } para forzar a este fetch
    // a obtener la versión más reciente del sitemap.xml y no usar el caché.
    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(
        `Error al leer el sitemap desde la URL ${url}: ${response.status} ${response.statusText}`
      );
    }
    const sitemapData = await response.text();
    return sitemapData;
  } catch (error) {
    console.error(`Error al leer el sitemap desde la URL ${url}:`, error);
    throw error;
  }
}
