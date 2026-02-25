import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        quote: resolve(__dirname, 'quote.html'),
        expense: resolve(__dirname, 'expense.html'),
        report: resolve(__dirname, 'report.html'),
        gallery: resolve(__dirname, 'gallery.html'),
        directory: resolve(__dirname, 'directory.html'),
        setup: resolve(__dirname, 'setup.html'),
        receipt: resolve(__dirname, 'receipt.html')
      }
    }
  }
});
