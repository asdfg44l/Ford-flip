<template>
  <div class="container mx-auto p-10">
    <h1 class="text-3xl font-bold mb-5 text-primary-1">表單演示</h1>
    
    <!-- Element Plus图标测试区域 -->
    <div class="mb-8 p-4 rounded bg-gray-1 border border-primary-1">
      <h2 class="text-xl font-bold mb-3 text-secondary-3">Element Plus 圖標測試:</h2>
      <div class="flex gap-4 flex-wrap">
        <el-button type="primary">
          <el-icon class="mr-2"><Plus /></el-icon>
          添加
        </el-button>
        <el-button type="success">
          <el-icon class="mr-2"><Check /></el-icon>
          確認
        </el-button>
        <el-button type="info">
          <el-icon class="mr-2"><InfoFilled /></el-icon>
          信息
        </el-button>
        <el-button type="warning">
          <el-icon class="mr-2"><Warning /></el-icon>
          警告
        </el-button>
        <el-button type="danger">
          <el-icon class="mr-2"><Delete /></el-icon>
          刪除
        </el-button>
      </div>
    </div>
    
    <el-form :model="formData" @submit.prevent="onSubmit">
      <div class="grid grid-cols-1 gap-5">
        <TElInput 
          v-model="formData.name" 
          name="name" 
          label="姓名" 
          :rules="{ required: true }"
        />
        
        <TElSelect
          v-model="formData.type"
          name="type"
          label="類型"
          :options="typeOptions"
          :rules="{ required: true }"
        />
        
        <div class="flex justify-end mt-5">
          <el-button 
            type="primary"
            class="btn btn-primary"
            @click="onSubmit"
          >
            <el-icon class="mr-1"><Check /></el-icon>
            提交
          </el-button>
        </div>
      </div>
    </el-form>
    
    <div v-if="isSubmitted" class="mt-8 p-4 rounded" style="background-color: rgba(109, 211, 107, 0.2);">
      <h2 class="text-xl font-semibold mb-2" style="color: #333333;">表單提交成功！</h2>
      <pre class="p-3 rounded text-white" style="background-color: #313247;">{{ JSON.stringify(formData, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { object, string } from 'yup'
import { Check, Delete, InfoFilled, Plus, Warning } from '@element-plus/icons-vue'

const formData = reactive({
  name: '',
  type: '',
})

const typeOptions = [
  { id: '1', label: '選項 A', value: 'A' },
  { id: '2', label: '選項 B', value: 'B' },
  { id: '3', label: '選項 C', value: 'C' },
]

const validationSchema = object({
  name: string().required('姓名不能為空'),
  type: string().required('類型不能為空'),
})

const isSubmitted = ref(false)

function onSubmit() {
  isSubmitted.value = true
  console.log('表單數據:', formData)
}
</script>

<style scoped>
.el-form {
  max-width: 800px;
  margin: 0 auto;
}

.container {
  max-width: 1200px;
}
</style> 