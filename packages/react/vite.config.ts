import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
    build: {
        lib: {
            entry: 'src/index.tsx',
            formats: ['es'],
            fileName: 'index'
        },
        rollupOptions: {
            external: ['react', 'react-dom', /^@agent-component\/core/]
        }
    },
    plugins: [dts()]
});
