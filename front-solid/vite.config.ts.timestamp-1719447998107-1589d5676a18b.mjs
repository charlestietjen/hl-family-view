// vite.config.ts
import { defineConfig } from "file:///C:/dev/highlevel/family-view/front-solid/node_modules/vite/dist/node/index.js";
import solid from "file:///C:/dev/highlevel/family-view/front-solid/node_modules/vite-plugin-solid/dist/esm/index.mjs";
import suidPlugin from "file:///C:/dev/highlevel/family-view/front-solid/node_modules/@suid/vite-plugin/index.mjs";
import devtools from "file:///C:/dev/highlevel/family-view/front-solid/node_modules/solid-devtools/dist/vite.js";
import path from "path";
var __vite_injected_original_dirname = "C:\\dev\\highlevel\\family-view\\front-solid";
var vite_config_default = defineConfig({
  plugins: [
    devtools({
      autoname: true
    }),
    suidPlugin(),
    solid()
  ],
  resolve: {
    alias: {
      "~": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  build: {
    target: "esnext"
  },
  server: {
    proxy: {
      "/api": "http://localhost:8090"
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxkZXZcXFxcaGlnaGxldmVsXFxcXGZhbWlseS12aWV3XFxcXGZyb250LXNvbGlkXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxkZXZcXFxcaGlnaGxldmVsXFxcXGZhbWlseS12aWV3XFxcXGZyb250LXNvbGlkXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9kZXYvaGlnaGxldmVsL2ZhbWlseS12aWV3L2Zyb250LXNvbGlkL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCBzb2xpZCBmcm9tICd2aXRlLXBsdWdpbi1zb2xpZCdcbmltcG9ydCBzdWlkUGx1Z2luIGZyb20gJ0BzdWlkL3ZpdGUtcGx1Z2luJ1xuaW1wb3J0IGRldnRvb2xzIGZyb20gJ3NvbGlkLWRldnRvb2xzL3ZpdGUnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgZGV2dG9vbHMoe1xuICAgICAgYXV0b25hbWU6IHRydWUsXG4gICAgfSksXG4gICAgc3VpZFBsdWdpbigpLFxuICAgIHNvbGlkKCldLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgIFwiflwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLFxuICAgIH1cbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICB0YXJnZXQ6IFwiZXNuZXh0XCIsXG4gIH0sXG4gIHNlcnZlcjoge1xuICAgIHByb3h5OiB7XG4gICAgICBcIi9hcGlcIjogXCJodHRwOi8vbG9jYWxob3N0OjgwOTBcIlxuICAgIH1cbiAgfVxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBb1QsU0FBUyxvQkFBb0I7QUFDalYsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8sY0FBYztBQUNyQixPQUFPLFVBQVU7QUFKakIsSUFBTSxtQ0FBbUM7QUFNekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsU0FBUztBQUFBLE1BQ1AsVUFBVTtBQUFBLElBQ1osQ0FBQztBQUFBLElBQ0QsV0FBVztBQUFBLElBQ1gsTUFBTTtBQUFBLEVBQUM7QUFBQSxFQUNULFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxJQUN0QztBQUFBLEVBQ0Y7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxFQUNWO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixPQUFPO0FBQUEsTUFDTCxRQUFRO0FBQUEsSUFDVjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
