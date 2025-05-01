// vite.config.js
export default {
  build: {
    rollupOptions: {
      external: ['firebase/auth']
    }
  }
}
