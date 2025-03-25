<template>
  <svg aria-hidden="true">
    <use :href="symbolId" />
  </svg>
</template>

<script>
export default {
  props: {
    prefix: {
      type: String,
      default: 'trevi',
    },
    name: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { prefix, name } = toRefs(props)
    const symbolId = computed(() => `#${prefix.value}-${name.value}`)

    return {
      symbolId,
    }
  },
}
</script>

<style scoped>
.svg-icon {
}
</style>
