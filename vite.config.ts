import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import WindiCSS from 'vite-plugin-windicss'
import path from 'path'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    WindiCSS(),
    // 自動導入 Element Plus 元件
    Components({
      resolvers: [
        ElementPlusResolver({
          importStyle: 'sass',
        }),
        IconsResolver({
          enabledCollections: ['ep'],
          customCollections: ['custom'],
        }),
      ],
      // 包含這些目錄中的組件
      dirs: ['src/components'],
      // 生成類型聲明文件
      dts: 'src/components.d.ts',
      // 自動導入子組件
      deep: true,
    }),
    Icons({
      autoInstall: true,
      customCollections: {
        custom: FileSystemIconLoader('./src/assets'),
      },
    }),
    // 自動導入 Element Plus 相關 API
    AutoImport({
      resolvers: [ElementPlusResolver()],
      imports: [
        'vue',
        'vue-router',
        {
          'vee-validate': ['useField', 'useForm'],
          yup: ['object', 'string', 'number', 'array', 'boolean'],
        },
      ],
      // 自動導入 Vue 的 ref 和 reactive
      dirs: ['src/composables'],
      dts: 'src/auto-imports.d.ts',
      eslintrc: {
        enabled: true,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "@/assets/styles/element/index.scss" as *;
          @use 'element-plus/theme-chalk/src/dark/css-vars.scss' as *;
        `,
      },
    },
  },
  base: '/Ford-flip/',
  build: {
    outDir: './docs',
    emptyOutDir: true, // also necessary
  },
})
