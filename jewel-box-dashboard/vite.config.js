// vite.config.js - Only basic Vite/React plugins
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(), // This should be your existing React plugin
    // Make sure tailwindcss() or @tailwindcss/vite is NOT here
  ],
  // Add any other Vite configuration options you had, e.g.,
  // server: {
  //   port: 3000,
  // },
});