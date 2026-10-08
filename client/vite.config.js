import path from "path";
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
    resolve: {
    alias: {      //when setting up shadcn-UI, It fkcing need alias
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
});