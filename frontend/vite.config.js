import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('dotlottie-')
        }
      }
    }),
    vueDevTools(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', '3.png', '4.png'],
      workbox: {
        maximumFileSizeToCacheInBytes: 5000000 // Increase limit to 5MB
      },
      manifest: {
        name: 'Attendict',
        short_name: 'Attendict',
        description: 'Attendance Management System for Interns and Staff',
        theme_color: '#133e75',
        icons: [
          {
            src: '4.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '4.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  server: {
    proxy: {
      '/geo': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
