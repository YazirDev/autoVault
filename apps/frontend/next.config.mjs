/** @type {import('next').NextConfig} */
const nextConfig = {
  // Exporta archivos estáticos para Tauri
  output: 'export',
  // Tauri no usa servidor de Next.js en producción
  trailingSlash: true,
  // Imágenes no optimizadas (Tauri no tiene servidor)
  images: {
    unoptimized: true,
  },
}

export default nextConfig