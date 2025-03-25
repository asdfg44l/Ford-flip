<template>
  <div class="flex flex-col relative h-screen bg-yellow-500 items-center overflow-hidden">
    <h1 class="text-4xl my-7">Grid Flip Card Game</h1>
    <div class="block absolute top-1/5 transition-all duration-800" :class="{ 'transform -translate-x-200vw': gameStarted }">
      <h2 class="text-3xl my-4">选择格子数量</h2>
      <select class="mt-4 px-2.5 py-1.5 text-base" v-model="selectedLevel" @change="startGame">
        <option value="" selected disabled>--选择--</option>
        <option value="6">简单</option>
        <option value="12">中等</option>
        <option value="20">困难</option>
      </select>
    </div>
    <div class="block absolute top-1/5 transition-all duration-200 delay-300 transform translate-x-200vw" :class="{ 'transform-none': gameStarted }">
      <div class="text-2xl mb-10">
        <span>计时器:</span>
        <span class="timer">{{ timer.toFixed(2) }}</span>
      </div>
      <div class="grid gap-2.5 justify-center m-5" 
        :class="{
          'grid-cols-3': !gridClass,
          'grid-cols-4': gridClass === 'middle',
          'grid-cols-5': gridClass === 'hard'
        }" 
        ref="gameGrid">
        <div 
          v-for="(image, index) in images" 
          :key="index" 
          class="w-25 h-25 bg-gray-500 flex justify-center items-center text-2xl cursor-pointer bg-cover bg-center"
          :class="{ 'bg-gray-500 !bg-none': !isFlipped(index) }"
          :style="cardStyle(index)"
          @click="flipCard(index)"
        ></div>
      </div>
      <button class="mt-5 px-5 py-2.5 text-base cursor-pointer bg-green-500 text-white border-0 rounded hover:bg-green-600" @click="resetGame">重置游戏</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'

// 根据 level 决定图片数量
function imageAmount(level: number): number {
  let imageAmountPools = [3]
  if (level >= 12) imageAmountPools = [level / 2, level / 4]

  imageAmountPools.sort(() => Math.random() - 0.5)

  return imageAmountPools.pop() || 3
}

// 获取图片池
function getImagesPools(level: number): string[] {
  const fileExtension = 'webp'
  const defaultImagesPools = ["image1", "image2", "image3", "image4", "image5", "image6"].map((item) => `/images/${item}.${fileExtension}`)
  
  // 随机排序
  defaultImagesPools.sort(() => Math.random() - 0.5)
  
  return defaultImagesPools.slice(0, imageAmount(level))
}

// 创建随机排序的图片数组
function createImages(level: number): string[] {
  const imagesPools = getImagesPools(level)
  const repeatTimes = level / imagesPools.length
  
  const images = imagesPools.join(',').concat(',').repeat(repeatTimes).split(',')
  images.pop()
  
  images.sort(() => Math.random() - 0.5)

  return images
}

// 加法函数，解决浮点数问题
function floatPlus(a: number, b: number): number {
  return parseFloat((a + b).toFixed(2))
}

// 响应式数据
const selectedLevel = ref<string>('')
const gameStarted = ref<boolean>(false)
const images = ref<string[]>([])
const flippedCards = ref<number[]>([])
const matchedCards = ref<number[]>([])
const timer = ref<number>(0)
const timerInterval = ref<number | null>(null)
const gridClass = computed(() => {
  const level = parseInt(selectedLevel.value)
  if (level === 12) return 'middle'
  if (level === 20) return 'hard'
  return ''
})

// 方法
function startGame() {
  const level = parseInt(selectedLevel.value)
  if (!level) return
  
  images.value = createImages(level)
  gameStarted.value = true
  startTimer()
}

function resetGame() {
  // 重置状态
  selectedLevel.value = ''
  gameStarted.value = false
  flippedCards.value = []
  matchedCards.value = []
  images.value = []
  
  // 停止计时器
  stopTimer()
  timer.value = 0
}

function flipCard(index: number) {
  const isFlipTwoCard = flippedCards.value.length < 2
  const isNotFlipped = !isFlipped(index)
  const isNotMatched = !matchedCards.value.includes(index)
  
  if (isFlipTwoCard && isNotFlipped && isNotMatched) {
    flippedCards.value.push(index)
  }
  
  if (flippedCards.value.length === 2) {
    checkMatch()
  }
}

function isFlipped(index: number): boolean {
  return flippedCards.value.includes(index) || matchedCards.value.includes(index)
}

function cardStyle(index: number) {
  if (isFlipped(index)) {
    return { backgroundImage: `url(${images.value[index]})` }
  }
  return {}
}

function checkMatch() {
  const [firstIndex, secondIndex] = flippedCards.value
  
  // 翻到相同的卡片
  if (images.value[firstIndex] === images.value[secondIndex]) {
    const matched = () => {
      matchedCards.value.push(...flippedCards.value)
      flippedCards.value = []
    }
    
    // 已经翻到最后一组卡片
    if (matchedCards.value.length === images.value.length - 2 && flippedCards.value.length === 2) {
      stopTimer()
      setTimeout(() => {
        matched()
        alert("恭喜！你已经匹配了所有卡片！")
      }, 70)
    } else {
      matched()
    }
  } 
  // 翻到不同的卡片
  else {
    setTimeout(() => {
      flippedCards.value = []
    }, 300)
  }
}

function startTimer() {
  timer.value = 0
  timerInterval.value = window.setInterval(() => {
    timer.value = floatPlus(timer.value, 0.01)
  }, 10)
}

function stopTimer() {
  if (timerInterval.value !== null) {
    clearInterval(timerInterval.value)
    timerInterval.value = null
  }
}

// 组件卸载时清除计时器
onUnmounted(() => {
  stopTimer()
})
</script> 