import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist' // <- garante que o build vai pra pasta usada no static.json
  },

   // 🔧 PROXY PARA DESENVOLVIMENTO LOCAL (EVITA ERRO DE CORS)
  // ❗ REMOVER ESTE BLOCO ANTES DE SUBIR PARA PRODUÇÃO
  /*server: {
    proxy: {
      '/user': {
        target: 'http://api.eletrihub.com',
        changeOrigin: true,
      },
    },
  }*/

  
})
