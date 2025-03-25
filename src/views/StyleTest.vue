<template>
  <div class="p-10">
    <h1 class="text-3xl font-bold mb-5 text-primary-1">黑字橙底样式测试</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <!-- 主色系展示 -->
      <div class="p-6 rounded-lg shadow-md">
        <h2 class="text-2xl font-bold mb-4 text-secondary-3">主色系 (Primary Colors)</h2>
        <div class="space-y-4">
          <div class="flex items-center">
            <div class="w-12 h-12 rounded bg-primary-1 mr-4"></div>
            <div>
              <p class="font-bold text-secondary-3">Primary 1</p>
              <p class="text-sm text-secondary-3">#FF9933</p>
            </div>
          </div>
          <div class="flex items-center">
            <div class="w-12 h-12 rounded bg-primary-2 mr-4"></div>
            <div>
              <p class="font-bold text-secondary-3">Primary 2</p>
              <p class="text-sm text-secondary-3">#FF8000</p>
            </div>
          </div>
          <div class="flex items-center">
            <div class="w-12 h-12 rounded bg-primary-3 mr-4"></div>
            <div>
              <p class="font-bold text-secondary-3">Primary 3</p>
              <p class="text-sm text-secondary-3">#FFAD60</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 文字色系展示 -->
      <div class="p-6 rounded-lg shadow-md">
        <h2 class="text-2xl font-bold mb-4 text-secondary-3">文字色系 (Text Colors)</h2>
        <div class="space-y-4">
          <div class="flex items-center">
            <div class="w-12 h-12 rounded bg-secondary-3 mr-4"></div>
            <div>
              <p class="font-bold text-secondary-3">Secondary 3 (Text)</p>
              <p class="text-sm text-secondary-3">#333333</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 按钮样式测试 -->
    <div class="p-6 rounded-lg shadow-md mb-8">
      <h2 class="text-2xl font-bold mb-4 text-secondary-3">按钮样式</h2>
      <div class="flex flex-wrap gap-4">
        <el-button type="primary">主要按钮</el-button>
        <el-button type="success">成功按钮</el-button>
        <el-button type="info">信息按钮</el-button>
        <el-button type="warning">警告按钮</el-button>
        <el-button type="danger">危险按钮</el-button>
      </div>
    </div>
    
    <!-- WindiCSS 工具类测试 -->
    <div class="p-6 rounded-lg shadow-md">
      <h2 class="text-2xl font-bold mb-4 text-secondary-3">WindiCSS 工具类测试</h2>
      
      <h3 class="text-xl font-bold mb-2 text-primary-1">边框和圆角</h3>
      <div class="flex flex-wrap gap-4 mb-6">
        <div class="w-24 h-24 bg-primary-1 rounded"></div>
        <div class="w-24 h-24 bg-primary-2 rounded-lg"></div>
        <div class="w-24 h-24 bg-primary-3 rounded-full"></div>
      </div>
      
      <h3 class="text-xl font-bold mb-2 text-primary-1">弹性布局</h3>
      <div class="flex justify-between items-center p-4 bg-gray-1 rounded mb-6">
        <div class="w-16 h-16 bg-primary-1 rounded"></div>
        <div class="w-16 h-16 bg-primary-2 rounded"></div>
        <div class="w-16 h-16 bg-primary-3 rounded"></div>
      </div>
      
      <h3 class="text-xl font-bold mb-2 text-primary-1">网格布局</h3>
      <div class="grid grid-cols-3 gap-4 mb-6">
        <div class="bg-primary-1 p-4 rounded text-center text-white">1</div>
        <div class="bg-primary-2 p-4 rounded text-center text-white">2</div>
        <div class="bg-primary-3 p-4 rounded text-center text-white">3</div>
        <div class="bg-secondary-1 p-4 rounded text-center text-white">4</div>
        <div class="bg-secondary-2 p-4 rounded text-center text-white">5</div>
        <div class="bg-secondary-3 p-4 rounded text-center text-white">6</div>
      </div>
      
      <h3 class="text-xl font-bold mb-2 text-primary-1">自定义shortcuts</h3>
      <div class="space-y-4">
        <h4 class="custom-h1">自定义标题 H1</h4>
        <h4 class="custom-h2">自定义标题 H2</h4>
        <h4 class="custom-h3">自定义标题 H3</h4>
        <p class="custom-p">自定义段落文字</p>
        <div class="bg-gradient p-4 rounded text-white">渐变背景</div>
        <p class="text-gradient">渐变文字效果</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 样式测试组件
</script> 