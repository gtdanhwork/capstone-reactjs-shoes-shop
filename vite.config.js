import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
	plugins: [react(), basicSsl()],
	server: {
		port: 5173,
		open: true,
	},
});
