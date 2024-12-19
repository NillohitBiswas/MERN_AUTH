import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.glb'],
  server:{
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        server: false,
      }
    }
  }
  
})
