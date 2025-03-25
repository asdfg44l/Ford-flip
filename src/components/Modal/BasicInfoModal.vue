<template>
  <VueFinalModal
    v-bind="attrs"
    class="modal"
    :content-class="contentClass"
    :focus-trap="false"
  >
    <h1
      class="custom-h4 px-5 mt-5"
      :class="{ 'text-center': config.textAlign === 'center' }"
    >
      <span class="text-gradient">{{ config.title }}</span>
    </h1>
    <!-- content -->
    <div
      class="text-sm text-white flex-auto flex items-center"
      :class="[
        config.textAlign === 'center' ? 'justify-center' : 'justify-start',
      ]"
    >
      <div class="flex items-center px-5">
        <ElIcon v-if="type === 'success'" size="24" class="text-success mr-2">
          <IEpSelect></IEpSelect>
        </ElIcon>
        <ElIcon v-else-if="type === 'error'" size="24" class="text-danger mr-2">
          <IEpCloseBold></IEpCloseBold>
        </ElIcon>
        <p :class="{ 'ml-1': config.haveHintIcon }" v-html="config.content"></p>
      </div>
    </div>
    <!-- button -->
    <div
      class="mt-3 mb-5 px-5 flex gap-1"
      :class="[config.haveConfirmButton ? 'justify-end' : 'justify-center']"
    >
      <ElButton
        v-if="config.haveConfirmButton"
        class="btn btn-gray-1"
        @click="$emit('closed')"
        >{{ $t('common.utilities.button.cancel') }}</ElButton
      >
      <ElButton
        v-if="config.haveConfirmButton"
        class="btn btn-primary"
        @click="$emit('confirm')"
        >{{ $t('common.utilities.button.confirm') }}</ElButton
      >
      <ElButton v-else class="btn btn-primary" @click="$emit('closed')">
        {{ $t('common.utilities.button.close') }}
      </ElButton>
    </div>
  </VueFinalModal>
</template>

<script setup>
import { VueFinalModal } from 'vue-final-modal'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  type: {
    type: String,
    default: () => '',
  },
  title: {
    type: String,
    default: () => null,
  },
  info: {
    type: String,
    default: () => '',
  },
})
const emit = defineEmits({
  confirm: null,
  closed: null,
})

const attrs = useAttrs()
const { type, info, title } = toRefs(props)
const { t } = useI18n()

const config = computed(() => {
  let modalConfig = {}
  const modalTitle = title.value
    ? title.value
    : t('common.utilities.dialog.systemInfo')

  switch (type.value) {
    case 'error':
      modalConfig = {
        title: modalTitle,
        size: 'md',
        content: info.value, // TODO mapping errorCode
        textAlign: 'center',
        haveHintIcon: true,
      }
      break
    case 'success':
      modalConfig = {
        title: modalTitle,
        size: 'md',
        content: info.value,
        textAlign: 'center',
        haveHintIcon: true,
      }
      break
    case 'confirm':
      modalConfig = {
        title: modalTitle,
        size: 'md',
        content: `${info.value}<br /><br />${t(
          'common.utilities.dialog.warning'
        )}`,
        textAlign: 'left',
        haveConfirmButton: true,
      }
      break
    case 'logout':
      modalConfig = {
        title: modalTitle,
        size: 'md',
        content: info.value,
        textAlign: 'left',
        haveConfirmButton: true,
      }
      break
  }
  return modalConfig
})
const contentClass = computed(
  () => `modal-content modal-${config.value.size} relative`
)
</script>
