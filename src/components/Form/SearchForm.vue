<template>
  <div class="flex flex-col h-full" :validation-schema="validationSchema">
    <TElInput
      v-model="user.type"
      class="mb-4"
      input-class="block w-full px-2 py-1"
      label-class="block mb-1"
      title="Type"
      name="type"
    />
    <TElInput
      v-model="user.name"
      input-class="block w-full px-2 py-1"
      label-class="block mb-1"
      title="Name"
      name="name"
    />
    <button class="btn btn-secondary block mt-auto -mx-4" @click="onSubmit()">
      Confirm
    </button>
  </div>
</template>

<script setup lang="ts">
import { object, string } from 'yup'

const emit = defineEmits(['update:TForm', 'confirm', 'exposeSubmit'])

const user = reactive({
  type: '',
  name: '',
})
// form rule schema
const validationSchema = object({
  type: string().required(),
  name: string().required(),
})

const { onSubmit } = useTForm(user, emit, validationSchema)
</script>
