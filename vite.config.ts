import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'
import * as path from 'path';

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		tailwindcss()
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src')
		}
	},
	optimizeDeps: {
		include: ['xc-console']
	},
	define: {},
	build: {
		assetsInlineLimit: 0,
		rollupOptions: {}
	},
	css: {
		preprocessorOptions: {
			scss: {
				api: 'modern'
			}
		}
	},
	server: {
		fs: {
			strict: false // Disable strict file serving restrictions
		}
	}
});
