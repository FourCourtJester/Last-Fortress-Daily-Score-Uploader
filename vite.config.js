import { defineConfig } from 'vite'

// Plugins
import react from '@vitejs/plugin-react'
import jsconfigPaths from 'vite-jsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  base: "/Last-Fortress-Daily-Score-Uploader/",
  plugins: [jsconfigPaths({
    extension: ['.js', '.json', '.jsx', '.scss']
  }), react()],
})
