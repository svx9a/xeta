import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 8080,
      host: '0.0.0.0',
      hmr: {
        overlay: false, // Disable error overlay for faster HMR
      },
    },
    plugins: [
      react({
        // Enable fast refresh for better HMR
        fastRefresh: true,
        // Enable JSX runtime for better performance
        jsxRuntime: 'automatic',
      }),
    ],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      }
    },
    build: {
      // Enable build caching for faster rebuilds
      watch: mode === 'development' ? {} : null,
      // Optimize chunk splitting
      rollupOptions: {
        output: {
          // Split vendor chunks for better caching
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'ui-vendor': ['lucide-react', 'recharts'],
          },
        },
      },
      // Enable source maps only in development
      sourcemap: mode === 'development',
      // Optimize bundle size
      minify: 'esbuild',
      target: 'esnext',
      // Enable CSS code splitting
      cssCodeSplit: true,
    },
    optimizeDeps: {
      // Pre-bundle dependencies for faster dev server startup
      include: [
        'react',
        'react-dom',
        'lucide-react',
        'recharts'
      ],
    },
  };
});
