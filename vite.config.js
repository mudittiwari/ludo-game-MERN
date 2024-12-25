import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';

const getConfig = ({ command, mode }) => ({
  server: {
    hmr: {
      protocol: 'ws', // or 'wss' for HTTPS
      host: 'localhost',
    },
  },
  plugins: [
    react(),
    legacy(),
  ],
})

export default getConfig;