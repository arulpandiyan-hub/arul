import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {

  // Only enable HTTPS for the dev server (laptop browser testing).
  // When building the dist for the Android APK, HTTPS must be off —
  // Capacitor bundles the dist as local files and does not need TLS.
  const isDevServer = command === 'serve';

  return {
    plugins: [
      react(),
      ...(isDevServer ? [basicSsl()] : []),
    ],
    server: {
      https: isDevServer ? true : false,
    },
  };

});
