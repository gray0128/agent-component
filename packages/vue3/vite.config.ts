import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

export default defineConfig({
    build: {
        lib: {
            entry: 'src/index.ts',
            formats: ['es'],
            fileName: 'index'
        },
        rollupOptions: {
            external: ['vue', /^@agent-component\/core/]
        }
    },
    plugins: [vue(), dts()]
});
