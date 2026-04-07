import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    base: '/',
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        sourcemap: false,
        rollupOptions: {
            input: 'index.html',
            output: {
                entryFileNames: 'assets/main.js',
                chunkFileNames: 'assets/[name].js',
                assetFileNames: 'assets/[name].[ext]'
            }
        }
    },
    server: {
        proxy: {
            '/api': {
                target: 'https://crud-ranhentos-idiomas.onrender.com',
                changeOrigin: true,
                secure: true
            }
        }
    }
});
