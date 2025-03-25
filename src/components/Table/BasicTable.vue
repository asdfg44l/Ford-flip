<template>
  <el-table
    ref="table"
    :data="data"
    :max-height="tableHeight"
    :show-summary="summary.show"
    :summary-method="summary.method"
  >
    <!-- 當 table-layout="auto" 表頭無法固定，故逐一設定欄位寬度 -->
    <!-- 不同 column 要有不同的設定，e.g. 固定與否，用 v-for 無法滿足需求，故逐一列出 -->
    <el-table-column
      v-for="{ key, label, align, minWidth, fixed } in columns"
      :key="key"
      :prop="key"
      :label="label"
      :align="align"
      :min-width="minWidth"
      :fixed="fixed"
    >
      <template #default="{ row }">
        <slot :name="key" v-bind="row">{{ row[key] }}</slot>
      </template>
    </el-table-column>
    <slot name="operation"></slot>
    <template #empty>
      <div class="flex flex-col items-center justify-center h-300px">
        <div class="empty w-212px h-200px h-auto"></div>
        <div class="custom-h5 text-secondary-3">
          {{ $t('common.utilities.table.noData') }}
        </div>
      </div>
    </template>
  </el-table>
</template>

<script lang="ts" setup>
const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  columns: {
    type: Object,
    required: true,
  },
  summary: {
    type: Object,
    default() {
      return {
        show: true,
        method: (value: any) => value,
      }
    },
  },
  bottomWhiteSpace: {
    type: Number,
    default: 80,
  },
})

const { height: WindowHeight } = useWindowSize()

const table = ref(null)
const { bottomWhiteSpace } = toRefs(props)

const { top: topOfTable } = useElementBounding(table)

const tableHeight = computed(() => {
  const availableWindowHeight = Math.max(
    200, // 至少有200
    WindowHeight.value - topOfTable.value - bottomWhiteSpace.value
  )

  return availableWindowHeight
})
</script>

<style lang="scss" scoped>
:deep(.el-table__body-wrapper .el-table__row td.el-table-fixed-column--left),
:deep(.el-table__body-wrapper .el-table__row td.el-table-fixed-column--right) {
  @apply bg-[#242632];
}

:deep(
    .el-table__body-wrapper
      .el-table__row.hover-row
      td.el-table-fixed-column--left
  ),
:deep(
    .el-table__body-wrapper
      .el-table__row.hover-row
      td.el-table-fixed-column--right
  ) {
  @apply bg-secondary-2;
}

.empty {
  background-image: url('@/assets/no_data.png');
}

:deep(.el-table__body-wrapper) {
  @apply font-normal;
}

:deep(.el-table__footer-wrapper) {
  @apply border-t-primary-3 font-normal;
  display: block !important; // 為了 nodata 顯示 footer
}

:deep(.el-table__footer-wrapper td.el-table__cell div) {
  @apply flex gap-2 justify-center;
}

:deep(
    .el-table__header-wrapper
      tr
      th.el-table-fixed-column--left.is-last-column::before
  ),
:deep(
    .el-table__header-wrapper
      tr
      th.el-table-fixed-column--right.is-last-column::before
  ),
:deep(
    .el-table__body-wrapper
      tr
      td.el-table-fixed-column--left.is-last-column::before
  ),
:deep(
    .el-table__body-wrapper
      tr
      td.el-table-fixed-column--right.is-last-column::before
  ),
:deep(
    .el-table__footer-wrapper
      tr
      td.el-table-fixed-column--left.is-last-column::before
  ),
:deep(
    .el-table__footer-wrapper
      tr
      td.el-table-fixed-column--right.is-last-column::before
  ) {
  right: 0;
}
</style>
