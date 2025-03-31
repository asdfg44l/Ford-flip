<template>
  <div
    class="flex flex-col relative min-h-100vh bg-[#f7f3e9] items-center overflow-hidden pb-24 xs:pb-32 hand-drawn-bg safari-padding"
  >
    <h1
      class="text-4xl sm:text-3xl xs:text-2xl my-5 text-[#34495e] hand-drawn-text"
    >
      《Ford來摸肚》
    </h1>
    <div
      class="block absolute top-1/5 transition-all duration-800 w-full px-4 text-center"
      :class="{ 'transform -translate-x-200vw': countdownStarted }"
    >
      <h2
        class="text-3xl sm:text-2xl xs:text-xl my-4 text-[#e74c3c] hand-drawn-text"
      >
        選擇格子數量
      </h2>
      <TElSelect
        class="mt-4 w-full max-w-xs mx-auto hand-drawn-select"
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
      class="block absolute top-1/3 flex flex-col items-center justify-center w-full px-4"
    >
      <h2
        class="text-4xl sm:text-3xl xs:text-2xl font-bold text-[#34495e] mb-4 hand-drawn-text"
      >
        遊戲即將開始
      </h2>
      <div class="countdown-timer font-bold text-[#e74c3c] hand-drawn-text">
        {{ countdownValue }}
      </div>
      <p
        class="text-xl sm:text-lg xs:text-base text-[#2980b9] mt-4 hand-drawn-text"
      >
        準備好了嗎？
      </p>
      <!-- 加載進度條 -->
      <div class="mt-8 w-60 sm:w-48 xs:w-40 bg-[#ecf0f1] h-3 hand-drawn-border">
        <div
          class="bg-[#27ae60] h-3 transition-all duration-300"
          :style="{ width: `${loadingProgress}%` }"
        ></div>
      </div>
      <p class="text-sm text-[#7f8c8d] mt-2 hand-drawn-text">
        圖片加載中... {{ loadingProgress }}%
      </p>
    </div>

    <div
      class="block absolute top-1/5 w-full px-2 sm:px-4 game-area"
      :style="{ display: gameStarted ? 'block' : 'none' }"
    >
      <div class="text-2xl sm:text-xl xs:text-lg mb-6 sm:mb-4 text-center">
        <span class="text-[#7f8c8d] hand-drawn-text">計時器:</span>
        <span class="timer font-bold text-[#e67e22] hand-drawn-text">{{
          timer.toFixed(2)
        }}</span>
      </div>
      <div
        class="grid justify-items-center items-center mx-auto hand-drawn-grid"
        :class="[
          !gridClass
            ? 'grid-cols-3 gap-2.5 sm:gap-2 xs:gap-1.5 w-full max-w-[28rem] mx-auto'
            : '',
          gridClass === 'middle'
            ? 'grid-cols-4 gap-2 sm:gap-1.5 xs:gap-1 w-full max-w-[32rem] mx-auto'
            : '',
          gridClass === 'hard'
            ? 'grid-cols-5 xs:grid-cols-4 gap-2 sm:gap-1.5 xs:gap-1 w-full max-w-[36rem] mx-auto'
            : '',
        ]"
        ref="gameGrid"
      >
        <div
          v-for="(image, index) in cardDeck"
          :key="index"
          class="card-item bg-[#ecf0f1] text-2xl cursor-pointer bg-cover bg-center w-full h-full hand-drawn-card"
          :class="{ 'bg-[#ecf0f1] !bg-none': !isFlipped(index) }"
          :style="cardStyle(index)"
          @click="flipCard(index)"
        ></div>
      </div>
      <div class="text-center mt-5 mb-20 xs:mb-16 sm:mb-12">
        <el-button
          type="success"
          class="btn btn-lg xs:btn-md hand-drawn-button"
          @click="resetGame"
        >
          重置遊戲
        </el-button>
      </div>
    </div>

    <!-- 製作團隊資訊 -->
    <div class="team-info">
      <div class="team-info-content">
        <div class="team-member">
          <div class="team-role">製作：</div>
          <div class="team-name">Ford 的右手 ✋</div>
        </div>
        <div class="team-member">
          <div class="team-role">共同製作 & 肚肚支援：</div>
          <div class="team-name">Eddie 🤲</div>
        </div>
        <div class="team-member">
          <div class="team-role">照片提供 & 摸肚 & 撩妹總監：</div>
          <div class="team-name">Ford 😏</div>
        </div>
      </div>
    </div>
    <!-- 版本號 -->
    <div class="version-info">v{{ APP_VERSION }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import fordPon from '@/assets/audio/ford_pon.mp3'
// 自動引入組件，不需要手動導入
// import TElSelect from '@/components/TElSelect.vue'
const APP_VERSION = __APP_VERSION__

// 音效相關
const matchSound = new Audio(fordPon)

// 根據 level 決定圖片數量
function imageAmount(level: number): number {
  let imageAmountPools = [3]
  if (level >= 12) imageAmountPools = [level / 4]

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
      // 播放配對成功音效
      matchSound.currentTime = 0
      matchSound.play().catch(error => {
        console.error('播放音效失敗:', error)
      })
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

<style lang="scss" scoped>
.timer {
  display: inline-block;
  min-width: 80px;
  text-align: right;
}

.card-item {
  aspect-ratio: 1;
  max-width: 7rem;
  max-height: 7rem;
  width: 100%;
  height: 100%;
}

/* 不同難度的卡片尺寸調整 */
.grid-cols-3 .card-item {
  width: 7rem;
  height: 7rem;
}

.grid-cols-4 .card-item {
  width: 6rem;
  height: 6rem;
}

.grid-cols-5 .card-item {
  width: 4.5rem;
  height: 4.5rem;
}

@media (max-width: 768px) {
  .grid-cols-3 .card-item {
    width: 6rem;
    height: 6rem;
  }

  .grid-cols-4 .card-item {
    width: 5rem;
    height: 5rem;
  }

  .grid-cols-5 .card-item {
    width: 3.8rem;
    height: 3.8rem;
  }
}

@media (max-width: 640px) {
  .grid-cols-3 .card-item {
    width: 5.5rem;
    height: 5.5rem;
  }

  .grid-cols-4 .card-item {
    width: 4.5rem;
    height: 4.5rem;
  }

  .xs\:grid-cols-4 .card-item {
    width: 4.5rem;
    height: 4.5rem;
  }
}

@media (max-width: 375px) {
  .grid-cols-3 .card-item {
    width: 5rem;
    height: 5rem;
  }

  .grid-cols-4 .card-item {
    width: 4rem;
    height: 4rem;
  }

  .xs\:grid-cols-4 .card-item {
    width: 4rem;
    height: 4rem;
  }
}

@media (max-width: 320px) {
  .grid-cols-3 .card-item {
    width: 4.5rem;
    height: 4.5rem;
  }

  .grid-cols-4 .card-item {
    width: 3.5rem;
    height: 3.5rem;
  }

  .xs\:grid-cols-4 .card-item {
    width: 3.5rem;
    height: 3.5rem;
  }
}

.countdown-timer {
  font-size: 8rem;
  animation: shake 1s infinite;
}

@keyframes shake {
  0%,
  100% {
    transform: rotate(-3deg);
  }
  50% {
    transform: rotate(3deg);
  }
}

@media (max-width: 640px) {
  .countdown-timer {
    font-size: 6rem;
  }
}

@media (max-width: 375px) {
  .countdown-timer {
    font-size: 5rem;
  }
}

/* 製作團隊資訊樣式 */
.team-info {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: rgba(255, 249, 235, 0.9);
  color: #34495e;
  padding: 0.6rem 0;
  text-align: center;
  font-size: 0.9rem;
  backdrop-filter: blur(5px);
  border-top: 3px solid #e67e22;
  border-image: url("data:image/svg+xml;charset=utf-8,%3Csvg width='100' height='8' viewBox='0 0 100 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 4C25 4 25 8 50 8C75 8 75 4 100 4C100 4 75 0 50 0C25 0 25 4 0 4Z' fill='%23e67e22'/%3E%3C/svg%3E")
    1 stretch;
  z-index: 10;
  font-family: 'Architects Daughter', 'Comic Sans MS', cursive;
}

.team-info-content {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 1.5rem;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}

.team-member {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.team-role {
  color: #7f8c8d;
  text-align: center;
  margin-bottom: 0.2rem;
}

.team-name {
  color: #e67e22;
  font-weight: bold;
}

@media (max-width: 768px) {
  .team-info-content {
    gap: 1.2rem;
    padding: 0 0.8rem;
  }
}

@media (max-width: 640px) {
  .team-info-content {
    flex-direction: column;
    gap: 0.3rem;
    padding: 0 0.5rem;
  }

  .team-info {
    padding: 0.5rem 0;
  }

  .team-member {
    margin-bottom: 0.1rem;
  }

  .team-role {
    margin-bottom: 0.1rem;
  }
}

@media (max-width: 375px) {
  .team-info {
    font-size: 0.7rem;
    padding: 0.5rem 0;
  }

  .team-role,
  .team-name {
    font-size: 0.65rem;
    line-height: 1.2;
  }
}

/* 手繪風格 */
.hand-drawn-text {
  font-family: 'Architects Daughter', 'Comic Sans MS', cursive;
  letter-spacing: 0.5px;
}

.hand-drawn-bg {
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23bdc3c7' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E"),
    url("data:image/svg+xml;charset=utf-8,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233498db' fill-opacity='0.05'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6h-2c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.hand-drawn-card {
  border: 3px solid #34495e;
  border-radius: 5px;
  background-color: white;
  box-shadow: 4px 4px 0 rgba(52, 73, 94, 0.2);
  position: relative;
  transition: all 0.2s ease;
  transform: rotate(var(--rotation, 0deg));
  --rotation: calc(random() * 4deg - 2deg);
}

.hand-drawn-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,0 L100,100 M100,0 L0,100' stroke='%2334495e' stroke-width='0.5' opacity='0.1'/%3E%3C/svg%3E");
  opacity: 0.2;
  pointer-events: none;
}

.hand-drawn-card:hover {
  transform: translateY(-5px) rotate(var(--rotation));
  box-shadow: 6px 8px 0 rgba(52, 73, 94, 0.3);
}

.hand-drawn-grid {
  padding: 15px;
  background-color: rgba(255, 255, 255, 0.8);
  border: 3px solid #34495e;
  border-radius: 10px;
  box-shadow: 0 0 0 4px rgba(52, 73, 94, 0.1);
  position: relative;
}

.hand-drawn-grid::before {
  content: '';
  position: absolute;
  top: -8px;
  left: -8px;
  right: -8px;
  bottom: -8px;
  border: 2px dashed #e67e22;
  border-radius: 15px;
  opacity: 0.5;
  z-index: -1;
}

.hand-drawn-button {
  background-color: #27ae60 !important;
  border: 3px solid #229954 !important;
  border-radius: 10px !important;
  color: white !important;
  font-family: 'Architects Daughter', 'Comic Sans MS', cursive !important;
  position: relative !important;
  box-shadow: 0 4px 0 #1e8449 !important;
  transition: all 0.2s ease !important;
  transform: rotate(-1deg) !important;
}

.hand-drawn-button:hover {
  transform: translateY(-2px) rotate(1deg) !important;
  box-shadow: 0 6px 0 #1e8449 !important;
}

.hand-drawn-button:active {
  transform: translateY(2px) rotate(0deg) !important;
  box-shadow: 0 1px 0 #1e8449 !important;
}

.hand-drawn-select :deep(.el-input__wrapper) {
  background-color: white !important;
  border: 3px solid #34495e !important;
  border-radius: 10px !important;
  box-shadow: none !important;
  transform: rotate(-0.5deg) !important;
}

.hand-drawn-select :deep(.el-input__inner) {
  color: #34495e !important;
  font-family: 'Architects Daughter', 'Comic Sans MS', cursive !important;
}

.hand-drawn-select :deep(.el-select-dropdown__item) {
  font-family: 'Architects Daughter', 'Comic Sans MS', cursive !important;
}

.hand-drawn-select :deep(.el-select-dropdown__item.selected) {
  color: #e67e22 !important;
  background-color: #ecf0f1 !important;
}

.hand-drawn-border {
  border: 2px solid #34495e;
  border-radius: 5px;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg width='6' height='6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M5 0h1L0 6V5zm1 5v1H5z' fill='%23e67e22' fill-opacity='.1' fill-rule='evenodd'/%3E%3C/svg%3E");
}

/* Safari 特定優化 */
@supports (-webkit-touch-callout: none) {
  .safari-padding {
    padding-bottom: env(safe-area-inset-bottom);
    min-height: -webkit-fill-available;
  }
  
  .team-info {
    padding-bottom: calc(0.6rem + env(safe-area-inset-bottom));
  }
  
  @media (max-width: 640px) {
    .team-info {
      padding-bottom: calc(0.5rem + env(safe-area-inset-bottom));
    }
  }
  
  @media (max-width: 375px) {
    .team-info {
      padding-bottom: calc(0.5rem + env(safe-area-inset-bottom));
    }
  }
}

/* 確保在 Safari 上內容不會被底部工具欄遮擋 */
@supports (-webkit-touch-callout: none) {
  .game-container {
    min-height: 100vh;
    min-height: -webkit-fill-available;
    padding-bottom: env(safe-area-inset-bottom);
  }
}

/* 優化 Safari 上的滾動行為 */
@supports (-webkit-touch-callout: none) {
  .card-item {
    -webkit-tap-highlight-color: transparent;
  }
  
  .hand-drawn-button {
    -webkit-tap-highlight-color: transparent;
  }
}

/* 遊戲區域底部間距優化 */
.game-area {
  padding-bottom: calc(env(safe-area-inset-bottom) + 5rem);
}

@media (max-width: 640px) {
  .game-area {
    padding-bottom: calc(env(safe-area-inset-bottom) + 4rem);
  }
}

@media (max-width: 375px) {
  .game-area {
    padding-bottom: calc(env(safe-area-inset-bottom) + 3.5rem);
  }
}
/* 版本號樣式 */
.version-info {
  color: #000;
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  font-size: 12px;
  z-index: 1000;
}

/* 重置按鈕容器優化 */
.text-center.mt-5 {
  position: relative;
  z-index: 20;
}

/* 確保在 Safari 上內容不會被底部工具欄遮擋 */
@supports (-webkit-touch-callout: none) {
  .game-container {
    min-height: 100vh;
    min-height: -webkit-fill-available;
    padding-bottom: calc(env(safe-area-inset-bottom) + 5rem);
  }
  
  @media (max-width: 640px) {
    .game-container {
      padding-bottom: calc(env(safe-area-inset-bottom) + 4rem);
    }
  }
  
  @media (max-width: 375px) {
    .game-container {
      padding-bottom: calc(env(safe-area-inset-bottom) + 3.5rem);
    }
  }
}
</style>
