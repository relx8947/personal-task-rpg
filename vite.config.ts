import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/personal-task-rpg/",
  plugins: [react()],
});
