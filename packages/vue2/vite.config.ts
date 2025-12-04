import { defineConfig } from 'vite';
import vue2 from '@vitejs/plugin-vue2';
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
    plugins: [vue2(), dts()]
});
