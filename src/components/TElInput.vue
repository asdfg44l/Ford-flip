<template>
  <ElFormItem
    class="input"
    v-bind="elFormItemProps"
    :error="elFormItemProps.error || errorMessage"
  >
    <template v-if="elFormItemProps?.label" #label>
      <span> {{ elFormItemProps?.label }} </span>
      <ElIcon
        v-if="(inputAttrs.required === '' || inputAttrs.required) ?? false"
        :size="Number(inputAttrs['asteroid-size']) ?? 10"
        class="!text-danger"
      >
        <IEpStarFilled></IEpStarFilled>
      </ElIcon>
    </template>
    <ElInput
      :model-value="value"
      v-bind:="{ ...inputAttrs, label: elFormItemProps?.label }"
      :class="inputAttrs['input-class']"
      @focus="isFocus = true"
      @blur="validateOnBlur()"
      @update:model-value="emit('update:modelValue', value)"
    >
      <template #prefix>
        <slot name="prefix"></slot>
      </template>
      <template #suffix>
        <slot name="suffix"></slot>
      </template>
    </ElInput>
    <template #error>
      <slot name="error" v-bind="{ elFormItemProps, errorMessage }"> </slot>
    </template>
  </ElFormItem>
</template>

<script setup lang="ts">
import type { FormItems } from './_props' // 給 ElFormItem 的 props
import { useTInput } from './_useTInput.ts'

const props = withDefaults(
  defineProps<
    FormItems & {
      modelValue?: string | number
      name: string
      rules?: Record<string, any> | string
    }
  >(),
  {
    inlineMessage: false,
    required: false,
    showMessage: true,
  }
)

const emit = defineEmits(['update:modelValue'])
defineOptions({
  inheritAttrs: false,
})

const inputAttrs = reactive({ ...useAttrs() })

function syncAttrs() {
  Object.assign(inputAttrs, useAttrs())
}

onUpdated(() => {
  syncAttrs()
})
const { modelValue, name, rules, ...others } = toRefs(props)
const elFormItemProps = reactive(others)

const { value, errorMessage, handleBlur, validate, meta } = useTInput(emit, {
  modelValue,
  name,
  rules,
})

const isFocus = ref(false)
async function validateOnBlur() {
  isFocus.value = false
  handleBlur()
  if (meta.touched) await validate()
}
</script>
