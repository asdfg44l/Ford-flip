# 翻牌記憶遊戲 - Vue3 + Vite 版本

這是一個使用Vue3、TypeScript和Vite框架開發的翻牌記憶遊戲。遊戲採用黑字橙底的設計風格，提供了簡單、中等和困難三種難度級別。

## 項目特點

- **技術棧**：Vue3 + TypeScript + Vite
- **現代化開發**：使用Vue3組合式API和TypeScript類型支持
- **響應式設計**：適配不同難度級別的卡片佈局
- **互動體驗**：倒計時動畫、翻牌效果和計時功能
- **UI框架**：集成Element Plus及其圖標系統
- **CSS框架**：使用WindiCSS實現快速樣式開發

## 遊戲功能

- **難度選擇**：
  - 簡單：6張卡片
  - 中等：12張卡片
  - 困難：20張卡片
  
- **遊戲流程**：
  1. 選擇難度級別
  2. 顯示3秒倒計時動畫
  3. 開始遊戲並計時
  4. 翻轉卡片尋找匹配對
  5. 找出所有匹配後遊戲結束

- **遊戲規則**：
  - 每次可以翻開兩張卡片
  - 如果兩張卡片圖案相同，則保持翻開狀態
  - 如果兩張卡片圖案不同，則自動翻回
  - 目標是找出所有匹配的卡片對

## 開發與構建

```bash
# 使用pnpm安裝依賴
pnpm install

# 本地開發
pnpm run dev

# 打包
pnpm run build

# 代碼檢查
pnpm run lint
```

## 技術細節

- **前端框架**：Vue 3 + Vue Router
- **構建工具**：Vite
- **樣式解決方案**：WindiCSS + SCSS
- **UI組件庫**：Element Plus
- **表單驗證**：Vee-Validate + Yup
- **圖標系統**：Element Plus Icons + Iconify

## 項目結構

```
/
├── public/            # 靜態資源
│   └── images/        # 卡片圖片資源
├── src/
│   ├── assets/        # 項目資源
│   ├── components/    # 可復用組件
│   ├── router/        # 路由配置
│   ├── views/         # 頁面視圖
│   └── main.ts        # 應用入口
└── vite.config.ts     # Vite配置
```

## 自定義主題

項目使用黑字橙底的設計風格，可以通過修改以下文件來自定義主題：

- `src/assets/styles/element/index.scss` - Element Plus主題變量
- `src/assets/styles/windicss/brandColors.js` - WindiCSS品牌顏色

## 開源協議

[MIT License](LICENSE) 