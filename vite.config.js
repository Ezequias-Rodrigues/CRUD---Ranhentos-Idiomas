import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'],
            refresh: true,
        }),
        tailwindcss(),
    ],
    server: {
        watch: {
            cors: true, //cors vive dando problema, espero que isso solucione
            strictPort: false,
            ignored: ['**/storage/framework/views/**'],
        },
    },
});
