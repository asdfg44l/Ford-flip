<template>
  <Suspense @pending="pending" @resolve="resolve">
    <slot></slot>
    <template #fallback>
      <slot name="fallback"></slot>
    </template>
  </Suspense>
</template>

<script>
export default {
  props: {
    pending: {
      type: Function,
      default: () => console.log('pending'),
    },
    resolve: {
      type: Function,
      default: () => console.log('resolve'),
    },
  },
  setup(props) {
    const { pending, resolve } = toRefs(props)

    return {
      pending,
      resolve,
    }
  },
}
</script>
