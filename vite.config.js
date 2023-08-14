import gltfPlugin from "vite-plugin-gltf";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

export default {
    base: './',
    root: 'src/',
    publicDir: "../public/",
    server:
    {
        port: 3600,
        sourcemap: true
    },
    build:
    {
        outDir: '../dist',
        emptyOutDir: true,
        sourcemap: true,
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        return 'vendor';
                    }
                },
            },
        }
    },
    plugins: [
        gltfPlugin(),
        wasm(),
        topLevelAwait()
    ]
}