import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // 빌드 최적화 (esbuild 사용 - 더 빠름)
    minify: 'esbuild',
    // 청크 크기 최적화
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          zustand: ['zustand'],
        },
      },
    },
    // 소스맵 비활성화 (프로덕션)
    sourcemap: false,
    // 에셋 최적화
    assetsInlineLimit: 4096,
  },
  // 개발 서버 최적화
  server: {
    hmr: {
      overlay: false,
    },
  },
  // 이미지 최적화
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg', '**/*.webp'],
})