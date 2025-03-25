<template>
  <ElFormItem
    class="input"
    v-bind="elFormItemProps"
    :error="elFormItemProps.error || errorMessage"
  >
    <template v-if="elFormItemProps.label" #label>
      <span> {{ elFormItemProps.label }} </span>
      <ElIcon
        v-if="(inputAttrs.required === '' || inputAttrs.required) ?? false"
        :size="Number(inputAttrs['asteroid-size']) ?? 10"
        class="!text-danger"
      >
        <IEpStarFilled></IEpStarFilled>
      </ElIcon>
    </template>
    <el-select
      :model-value="value"
      :class="inputAttrs['input-class']"
      :disabled="Boolean(inputAttrs.disabled)"
      :teleported="Boolean(inputAttrs.teleported)"
      v-bind:="inputAttrs"
      @update:model-value="(val) => emit('update:modelValue', val)"
    >
      <el-option
        v-for="item in options"
        :key="item.id"
        :label="item.label"
        :value="item.value"
      >
        <slot name="option" v-bind="{ label: item.label, value: item.value }">
          <div class="flex items-center">
            <ElIcon class="text-primary-1 check-sign" :size="14">
              <IEpSelect></IEpSelect>
            </ElIcon>
            <p class="font-normal ml-2">{{ item.label }}</p>
          </div>
        </slot>
      </el-option>
    </el-select>
  </ElFormItem>
</template>

<script setup lang="ts">
import type { FormItems } from './_props'
import { useTInput } from './_useTInput.ts'

const props = withDefaults(
  defineProps<
    FormItems & {
      modelValue?: string | number
      name: string
      rules?: Record<string, any> | string
      options?: Array<{ id: string | number; label: string; value: any }>
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

const { modelValue, name, rules, options, ...others } = toRefs(props)
const elFormItemProps = reactive(others)

const { value, errorMessage } = useTInput(emit, { modelValue, name, rules })
</script>

<style lang="scss" scoped>
:deep(.el-select) {
  @apply w-full;
}

/**
select 在特定情況下會有 height = 38px 的設定
發生時機：size 在 el-form 屬性動態綁定 size 為 'large'、在 el-form-item 及 el-select 上去給定 'large' 字串都會發生
例外狀況：當 size 在 el-form 直接給屬性 size = 'large' 字串卻不會觸發 height = 38px 的設定
這裡直接進行強制覆蓋
*/
/** 這個東西就是要這樣註解，不然會報錯
:deep(.el-select--large .el-input__inner) {
  height: calc(v-bind('variables.commonComponentSizeLarge') - 2px) !important;
}
:deep(.el-select--default .el-input__inner) {
  height: calc(v-bind('variables.commonComponentSizeDefault') - 2px) !important;
}
:deep(.el-select--small .el-input__inner) {
  height: calc(v-bind('variables.commonComponentSizeSmall') - 2px) !important;
}
*/

//index.scss 改不動！
.el-select-dropdown__item .check-sign {
  @apply hidden;
}
.el-select-dropdown__item.selected .check-sign {
  @apply block;
}
.el-select-dropdown__item.selected .check-sign {
  @apply block;
}
</style>
