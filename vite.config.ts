import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // This repository is published under /TH-COMPANY-ERP/ on GitHub Pages.
  base: "/TH-COMPANY-ERP/",
  plugins: [react()],
});
