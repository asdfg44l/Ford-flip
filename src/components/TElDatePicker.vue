<template>
  <ElFormItem
    v-bind="elFormItemProps"
    :error="elFormItemProps.error || errorMessage"
  >
    <template v-if="inputAttrs.label" #label>
      <div class="text-sm whitespace-nowrap text-secondary-3">
        {{ inputAttrs.label }}
        <ElIcon
          v-if="(inputAttrs.required === '' || inputAttrs.required) ?? false"
          :size="Number(inputAttrs['asteroid-size']) ?? 10"
          class="!text-danger"
        >
          <IEpStarFilled></IEpStarFilled>
        </ElIcon>
      </div>
    </template>
    <ElConfigProvider :locale="locale">
      <ElDatePicker
        :model-value="value"
        v-bind:="inputAttrs"
        :type="type"
        popper-class="trevi-datepicker"
        :disabled-date="disabledDate"
        @calendar-change="calendarChange"
        @visible-change="calendarChange(null)"
        @update:model-value="emit('update:modelValue', value)"
      />
    </ElConfigProvider>
  </ElFormItem>
</template>

<script setup lang="ts">
import type { Language } from 'element-plus/es/locale'
import type { DatePickType } from 'element-plus'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import type { FormItems } from './_props'
import { useTInput } from './_useTInput.ts'

const props = withDefaults(
  defineProps<
    FormItems & {
      modelValue?: string | number | Date | Array<string | number | Date>
      name: string
      rules?: Record<string, any> | string
      type?: DatePickType
      locale?: Language
      dateRange: [number, number]
      selectingRange?: number
    }
  >(),
  {
    inlineMessage: false,
    required: false,
    showMessage: true,
    type: 'daterange',
    selectingRange: 0,
  }
)
const emit = defineEmits(['update:modelValue'])

dayjs.extend(duration)

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

const { modelValue, name, rules, dateRange, selectingRange, ...others } =
  toRefs(props)
const elFormItemProps = reactive(others)

const { value, errorMessage } = useTInput(emit, { modelValue, name, rules })

const selectedDates = ref<[Date, Date] | null>(null)

function calendarChange(val: [Date, Date] | null) {
  if (selectingRange.value > 0) {
    selectedDates.value = val
  }
}

/** 判斷是否要 disabled datepicker上的日期
 * a. 這裡會去使用 dateRange來判斷
 *
 * ex: [30, 30] 代表可選取的範圍為前30天以及後30天 (以今日為基準)
 * [30, 0] 代表只可選取前30天的資料
 * [0, 30] 代表只可選取後30天的資料
 *
 * b. selectedDates: 使用者是否正在選取日期，動態切換 disabledDate 的邏輯
 * 為了SPEC
 * 1. 最大可查詢日期區間為 30 天(含當日)
 * 2. 最歷史可查詢資料為 3 個月前，部分規格如有特殊定義，則以規格頁面所述為準
 *
 *
 * @param date: 由datePicker回傳的 Date資料
 */
function disabledDate(date: Date) {
  const currentDate = dayjs().startOf('date')
  const checkDate = dayjs(date)

  // SPEC 上的選取範圍要包含當日，所以 range 要扣掉一天
  const isBeforeDateRange = (
    checkDate: dayjs.Dayjs,
    range: number,
    compareDate: dayjs.Dayjs = currentDate
  ) => checkDate.isBefore(compareDate.subtract(range - 1, 'day'), 'day')

  const isAfterDateRange = (
    checkDate: dayjs.Dayjs,
    range: number,
    compareDate: dayjs.Dayjs = currentDate
  ) => checkDate.isAfter(compareDate.add(range - 1, 'day'), 'day')

  /** 以今日為基準，超過範圍都不能選取 */
  if (
    isBeforeDateRange(checkDate, dateRange.value[0]) ||
    isAfterDateRange(checkDate, dateRange.value[1] + 1) // 要把今天加進去
  )
    return true

  /**
   * 有正在選取中的日期, 則根據 selectingRange 動態切換 disabledDated 的範圍
   */
  if (selectedDates.value) {
    const firstSelectedDate = dayjs(selectedDates.value[0])

    return (
      isBeforeDateRange(checkDate, selectingRange.value, firstSelectedDate) ||
      isAfterDateRange(checkDate, selectingRange.value, firstSelectedDate)
    )
  }

  return false
}
</script>

<style lang="scss" scoped>
:deep(.el-date-editor .el-range-separator) {
  @apply text-secondary-3;
}
:deep(.el-date-editor) {
  .el-icon.el-input__icon {
    @apply hidden;
  }
}

/**
range editor 的 dom 結構跟其他的 input 不一樣，
會吃不到 windi.config.js 裡面的 input css，所以要另外處理
*/
.el-form-item {
  :deep(.el-input__wrapper) {
    &.is-disabled {
      opacity: 0.6;
    }
  }

  &--large:deep(.el-input__wrapper) {
    --el-input-border-radius: 1rem;
  }
}

/**
跟 sventa 確認過， datepicker 不要有 hover & active 效果。
*/
.el-form-item {
  :deep(.el-input) {
    --el-input-focus-border-color: #8087b0;
    @apply shadow-none;
  }
  :deep(.el-input__wrapper) {
    --el-input-focus-border-color: #8087b0;
  }
}
</style>

<style lang="scss">
//GLOBAL!!! for popper date picker class
.trevi-datepicker.is-light.el-popper {
  @apply bg-secondary-1;
  .el-popper {
    &__arrow::before {
      @apply bg-secondary-1 border-secondary-1;
    }
  }

  //date picker header
  .el-date-picker,
  .el-date-range-picker {
    &__header {
      @apply text-white;
      &-label {
        @apply text-white;
      }

      .el-picker-panel__icon-btn {
        @apply hover:text-primary-3;
      }
    }
  }

  .el-picker-panel {
    @apply bg-secondary-1;
    .el-date-table {
      th {
        @apply border-primary-3;
      }
      td {
        & {
          &:hover {
            .el-date-table-cell {
              .el-date-table-cell__text {
                @apply bg-white;
              }
            }

            &.start-date,
            &.end-date {
              .el-date-table-cell {
                .el-date-table-cell__text {
                  @apply bg-primary-1;
                }
              }
            }
          }
        }

        &.disabled {
          .el-date-table-cell {
            @apply bg-secondary-1;

            .el-date-table-cell__text {
              @apply bg-secondary-1 text-secondary-3 text-opacity-40;
            }
          }
        }
      }
    }
    .el-month-table,
    .el-year-table {
      td {
        & {
          .cell {
            @apply text-secondary-3;
          }
          &.today {
            .cell {
              @apply text-primary-1;
            }
          }
          &.current {
            .cell {
              @apply text-white bg-primary-1;
            }
          }
          &:hover {
            .cell {
              @apply text-primary-1 bg-white;
            }
          }
        }

        &.disabled {
          .cell {
            @apply bg-secondary-1 text-secondary-3 text-opacity-40;
          }
        }
      }
    }
  }
}
</style>
