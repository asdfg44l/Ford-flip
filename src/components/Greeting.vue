<template>
  <div>
    <slot name="title" content="scope content"></slot>
    <p :class="attrs.class">Hiiiiii</p>
    <slot></slot>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  setup(props, { attrs }) {
    return {
      attrs,
    }
  },
}
</script>
