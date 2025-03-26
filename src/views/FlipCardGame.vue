<template>
  <div
    class="flex flex-col relative h-100vh bg-primary-2 bg-opacity-20 items-center overflow-hidden"
  >
    <h1 class="text-4xl my-7 text-primary-1">《Ford來摸肚》</h1>
    <div
      class="block absolute top-1/5 transition-all duration-800"
      :class="{ 'transform -translate-x-200vw': countdownStarted }"
    >
      <h2 class="text-3xl my-4 text-secondary-3">選擇格子數量</h2>
      <TElSelect
        class="mt-4"
        :model-value="selectedLevel"
        name="difficulty"
        input-class="text-base"
        :options="difficultyOptions"
        @update:model-value="startCountdown"
      />
    </div>

    <!-- 倒數計時畫面 -->
    <div
      v-if="countdownStarted && !gameStarted"
      class="block absolute top-1/3 flex flex-col items-center justify-center"
    >
      <h2 class="text-4xl font-bold text-primary-1 mb-4">遊戲即將開始</h2>
      <div class="countdown-timer text-9xl font-bold text-primary-1">
        {{ countdownValue }}
      </div>
      <p class="text-xl text-secondary-3 mt-4">準備好了嗎？</p>
      <!-- 加載進度條 -->
      <div class="mt-8 w-60 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div
          class="bg-primary-1 h-2.5 rounded-full transition-all duration-300"
          :style="{ width: `${loadingProgress}%` }"
        ></div>
      </div>
      <p class="text-sm text-secondary-3 mt-2">
        圖片加載中... {{ loadingProgress }}%
      </p>
    </div>

    <div
      class="block absolute top-1/5"
      :style="{ display: gameStarted ? 'block' : 'none' }"
    >
      <div class="text-2xl mb-10 text-center">
        <span class="text-secondary-3">計時器:</span>
        <span class="timer font-bold text-primary-1">{{
          timer.toFixed(2)
        }}</span>
      </div>
      <div
        class="grid gap-2.5 justify-center m-5"
        :class="{
          'grid-cols-3': !gridClass,
          'grid-cols-4': gridClass === 'middle',
          'grid-cols-5': gridClass === 'hard',
        }"
        ref="gameGrid"
      >
        <div
          v-for="(image, index) in cardDeck"
          :key="index"
          class="w-25 h-25 bg-secondary-2 flex justify-center items-center text-2xl cursor-pointer bg-cover bg-center rounded-lg shadow-md hover:shadow-lg"
          :class="{ 'bg-secondary-2 !bg-none': !isFlipped(index) }"
          :style="cardStyle(index)"
          @click="flipCard(index)"
        ></div>
      </div>
      <el-button type="success" class="mt-5 btn btn-lg" @click="resetGame">
        重置遊戲
      </el-button>
    </div>

    <!-- 製作團隊資訊 -->
    <div class="team-info">
      <div class="team-info-content">
        <div class="team-member">
          <span class="team-role">製作：</span>
          <span class="team-name">Ford 的右手 ✋</span>
        </div>
        <div class="team-member">
          <span class="team-role">共同製作 & 肚肚支援：</span>
          <span class="team-name">Eddie 🤲</span>
        </div>
        <div class="team-member">
          <span class="team-role">照片提供 & 摸肚 & 撩妹總監：</span>
          <span class="team-name">Ford 😏</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
// 自動引入組件，不需要手動導入
// import TElSelect from '@/components/TElSelect.vue'

// 根據 level 決定圖片數量
function imageAmount(level: number): number {
  let imageAmountPools = [3]
  if (level >= 12) imageAmountPools = [level / 2, level / 4]

  imageAmountPools.sort(() => Math.random() - 0.5)

  return imageAmountPools.pop() || 3
}

// 獲取圖片池
function getImagesPools(level: number): string[] {
  const fileExtension = 'webp'
  const defaultImagesPools = [
    'image1',
    'image2',
    'image3',
    'image4',
    'image5',
    'image6',
  ].map((item) => `/images/${item}.${fileExtension}`)

  // 隨機排序
  defaultImagesPools.sort(() => Math.random() - 0.5)

  return defaultImagesPools.slice(0, imageAmount(level))
}

// 創建隨機排序的圖片數組
function createImages(level: number): string[] {
  const imagesPools = getImagesPools(level)
  const repeatTimes = level / imagesPools.length

  const images = imagesPools
    .join(',')
    .concat(',')
    .repeat(repeatTimes)
    .split(',')
  images.pop()

  images.sort(() => Math.random() - 0.5)

  return images
}

// 加法函數，解決浮點數問題
function floatPlus(a: number, b: number): number {
  return parseFloat((a + b).toFixed(2))
}

// 響應式數據
const selectedLevel = ref<string>('')
const countdownStarted = ref<boolean>(false)
const gameStarted = ref<boolean>(false)
const countdownValue = ref<number>(3)
const countdownInterval = ref<number | null>(null)
const imagesLoaded = ref<boolean>(false)
const loadingProgress = ref<number>(0)
const cardDeck = ref<string[]>([])
const flippedCards = ref<number[]>([])
const matchedCards = ref<number[]>([])
const timer = ref<number>(0)
const timerInterval = ref<number | null>(null)
const difficultyOptions = [
  { id: '1', label: '--選擇--', value: '', disabled: true },
  { id: '2', label: '簡單', value: '6' },
  { id: '3', label: '中等', value: '12' },
  { id: '4', label: '困難', value: '20' },
]
const gridClass = computed(() => {
  const level = parseInt(selectedLevel.value)
  if (level === 12) return 'middle'
  if (level === 20) return 'hard'
  return ''
})

function preloadImages(images: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    let loadedCount = 0
    const totalImages = images.length

    images.forEach((image) => {
      const img = new Image()
      img.onload = () => {
        loadedCount++
        loadingProgress.value = Math.floor((loadedCount / totalImages) * 100)
        if (loadedCount === totalImages) {
          imagesLoaded.value = true
          resolve()
        }
      }
      img.onerror = reject
      img.src = `${import.meta.env.BASE_URL}${image.replace(/^\//, '')}`
    })
  })
}

// 倒數計時開始
function startCountdown(value: string) {
  selectedLevel.value = value
  const level = parseInt(selectedLevel.value)
  if (!level) return

  // 設置倒數計時狀態
  countdownStarted.value = true
  countdownValue.value = 3

  // 在倒數時就開始準備卡片和預加載圖片
  cardDeck.value = createImages(level)
  preloadImages(cardDeck.value).catch((error) => {
    console.error('圖片加載失敗:', error)
    alert('圖片加載失敗，請重新開始遊戲')
    resetGame()
  })

  // 開始倒數
  countdownInterval.value = window.setInterval(() => {
    countdownValue.value -= 1

    // 倒數結束，開始遊戲
    if (countdownValue.value <= 0) {
      clearInterval(countdownInterval.value as number)
      countdownInterval.value = null
      startGame()
    }
  }, 1000)
}

// 開始遊戲
function startGame() {
  if (!imagesLoaded.value) {
    // 如果圖片還沒加載完，等待加載完成
    const checkInterval = setInterval(() => {
      if (imagesLoaded.value) {
        clearInterval(checkInterval)
        gameStarted.value = true
        startTimer()
      }
    }, 100)
  } else {
    gameStarted.value = true
    startTimer()
  }
}

function resetGame() {
  selectedLevel.value = ''
  countdownStarted.value = false
  gameStarted.value = false
  countdownValue.value = 3
  imagesLoaded.value = false
  loadingProgress.value = 0

  if (countdownInterval.value !== null) {
    clearInterval(countdownInterval.value)
    countdownInterval.value = null
  }

  stopTimer()
  timer.value = 0
  flippedCards.value = []
  matchedCards.value = []
  cardDeck.value = []
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
  return (
    flippedCards.value.includes(index) || matchedCards.value.includes(index)
  )
}

function cardStyle(index: number) {
  if (isFlipped(index)) {
    return {
      backgroundImage: `url(${import.meta.env.BASE_URL}${cardDeck.value[
        index
      ].replace(/^\//, '')})`,
    }
  }
  return {}
}

function checkMatch() {
  const [firstIndex, secondIndex] = flippedCards.value

  // 翻到相同的卡片
  if (cardDeck.value[firstIndex] === cardDeck.value[secondIndex]) {
    const matched = () => {
      matchedCards.value.push(...flippedCards.value)
      flippedCards.value = []
    }

    // 已經翻到最後一組卡片
    if (matchedCards.value.length === cardDeck.value.length - 2) {
      stopTimer()
      setTimeout(() => {
        matched()
        alert('恭喜！你已經匹配了所有卡片！')
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

// 組件卸載時清除計時器
onUnmounted(() => {
  stopTimer()
  if (countdownInterval.value !== null) {
    clearInterval(countdownInterval.value)
    countdownInterval.value = null
  }
})
</script>

<style scoped>
.timer {
  display: inline-block;
  min-width: 80px;
  text-align: right;
}

.w-25 {
  width: 6.25rem;
  height: 6.25rem;
}

.h-25 {
  height: 6.25rem;
}

.countdown-timer {
  font-size: 8rem;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

/* 製作團隊資訊樣式 */
.team-info {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  color: #fff;
  padding: 0.7rem 0;
  text-align: center;
  font-size: 0.9rem;
  backdrop-filter: blur(5px);
  border-top: 1px solid rgba(255, 165, 0, 0.3);
}

.team-info-content {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  max-width: 650px;
  margin: 0 auto;
}

.team-member {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.team-role {
  color: #ccc;
}

.team-name {
  color: #ffa500;
  font-weight: bold;
}

.team-warning {
  color: #ff6b6b;
  font-size: 0.8rem;
  margin-top: 0.5rem;
  font-style: italic;
}

@media (min-width: 640px) {
  .team-info-content {
    flex-direction: row;
    justify-content: center;
    gap: 1.5rem;
  }
  
  .team-info {
    padding: 0.5rem 0;
  }
}
</style>
