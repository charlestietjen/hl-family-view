import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import suidPlugin from '@suid/vite-plugin'
import devtools from 'solid-devtools/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    devtools({
      autoname: true,
    }),
    suidPlugin(),
    solid()],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
    }
  },
  build: {
    target: "esnext",
    outDir: "../expressserver/dist/public"
  },
  server: {
    proxy: {
      "/api": "http://localhost:8090"
    }
  }
})
