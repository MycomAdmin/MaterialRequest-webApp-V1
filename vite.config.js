// vite.config.js
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: "autoUpdate",
            injectRegister: "auto",

            // Workbox configuration
            workbox: {
                globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2,ttf}"],
                runtimeCaching: [
                    {
                        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                        handler: "CacheFirst",
                        options: {
                            cacheName: "google-fonts-cache",
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 60 * 60 * 24 * 365,
                            },
                            cacheableResponse: {
                                statuses: [0, 200],
                            },
                        },
                    },
                ],
            },

            // Manifest configuration
            manifest: {
                name: "MaterialFlow Pro",
                short_name: "MaterialFlow",
                description: "Material management system",
                theme_color: "#4361ee",
                background_color: "#ffffff",
                display: "standalone",
                orientation: "portrait",
                scope: "/",
                start_url: "/",
                icons: [
                    {
                        src: "pwa-192x192.png",
                        sizes: "192x192",
                        type: "image/png",
                    },
                    {
                        src: "pwa-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                    },
                ],
            },

            // Development options
            devOptions: {
                enabled: true,
                type: "module",
                navigateFallback: "index.html",
            },
        }),
    ],
    server: {
        port: 1175,
        host: true,
    },
});
