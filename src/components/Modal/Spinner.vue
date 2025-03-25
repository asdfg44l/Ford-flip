<template>
  <VueFinalModal
    v-bind="attrs"
    click-to-close
    esc-to-close
    :focus-trap="false"
    class="modal"
  >
    <TIcon name="spinner" class="h-36 w-36 animate-spin text-green-400" />
  </VueFinalModal>
</template>

<script setup>
import { VueFinalModal } from 'vue-final-modal'

const attrs = useAttrs()
</script>

<style scoped lang="scss"></style>
