<template>
  <VueFinalModal v-bind="attrs" class="modal" :content-class="contentClass">
    <h1 class="text-white text-center text-2xl my-2">{{ attrs.title }}</h1>
    <div class="px-5 mt-3 mb-5 flex-auto">
      <slot></slot>
    </div>
    <div
      class="right-0 absolute px-3 pt-1 text-red-600 text-xl cursor-pointer"
      @click="onClose()"
    >
      x
    </div>
  </VueFinalModal>
</template>

<script setup>
import { VueFinalModal, useVfm } from 'vue-final-modal'

const props = defineProps({
  size: {
    type: String,
    default: () => 'md',
  },
  closedBy: {
    type: String,
    default: () => 'emitEvent',
  },
})
const emit = defineEmits({
  closed: null,
})

const attrs = useAttrs()

const { size, closedBy } = toRefs(props)

const vfm = useVfm()
function onClose() {
  switch (closedBy.value) {
    case 'id':
      vfm.close(attrs['modal-id'])
      break

    default:
      emit('closed')
      break
  }
}

const contentClass = computed(
  () => `modal-content modal-${size.value} relative`
)
</script>
