import vue from '@vitejs/plugin-vue';
import type { ConfigEnv, UserConfig } from 'vite';
import { defineConfig } from 'vite';
import vuetify from 'vite-plugin-vuetify';
import { pluginExposeRenderer } from './vite.base.config';

// https://vitejs.dev/config
export default defineConfig((env) => {
  const forgeEnv = env as ConfigEnv<'renderer'>;
  const { root, mode, forgeConfigSelf } = forgeEnv;
  const name = forgeConfigSelf.name ?? '';

  return {
    root,
    mode,
    base: './',
    build: {
      outDir: `.vite/renderer/${name}`,
    },
    plugins: [vue(), vuetify({ autoImport: true }), pluginExposeRenderer(name)],
    resolve: {
      preserveSymlinks: true,
    },
    // css: {
    //   preprocessorOptions: {
    //     scss: {
    //       additionalData: `@use  "src/styles/_variables.scss" as *;`,
    //     }
    //   }
    // },
    clearScreen: false,
  } as UserConfig;
});