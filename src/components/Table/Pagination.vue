<template>
  <div
    class="flex justify-end items-center bg-secondary-1 bg-opacity-60 rounded-2xl p-3"
    :class="[containerClass]"
  >
    <i18n-t
      :keypath="attrs.keypath"
      tag="p"
      class="text-secondary-3 mr-4"
      scope="global"
    >
      <span class="text-white">{{ getNumber(totalPages, true) }}</span>
    </i18n-t>
    <ElPagination
      v-model:current-page="_currentPage"
      v-model:page-size="_pageSize"
      v-bind="attrs"
    >
    </ElPagination>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { getNumber } from '@/utils/tools'

const props = defineProps({
  currentPage: {
    type: Number,
  },
  pageSize: {
    type: Number,
    default: 50,
  },
  pagerCount: {
    type: Number,
  },
  totalPages: {
    type: [Number, String],
    default: 0,
  },
  containerClass: {
    type: String,
    default: '',
  },
})

const emit = defineEmits([
  'update:currentPage',
  'update:pageSize',
  'sizeChange',
  'currentChange',
])

defineOptions({
  inheritAttrs: false,
})

const { t } = useI18n()

const attrs = useAttrs()

const _currentPage = useVModel(props, 'currentPage', emit)
const _pageSize = useVModel(props, 'pageSize', emit)

// 以下的 function 目前還有支援，但官方已不推薦使用，後續版本會被移除
function handlePrevClick(e: any) {
  console.log('prev', e)
}

function handleNextClick(e: any) {
  console.log('next', e)
}

function handleSizeChange(val: number) {
  console.log(`p ${val} items per page`)
  emit('sizeChange', val)
}

function handleCurrentChange(val: number) {
  console.log(`p current page: ${val}`)
  emit('currentChange', val)
}
</script>

<style lang="scss" scoped></style>
