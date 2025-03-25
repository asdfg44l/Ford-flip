<template>
  <TestModal :modal-id="TestModalId" closed-by="id" />
  <Spinner :modal-id="SpinnerModalId" />
</template>

<script setup>
const dialogsStore = useDialogsStore()

const TestModalId = dialogsStore.TestModal.key
const SpinnerModalId = dialogsStore.Spinner.key
</script>
