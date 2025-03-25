<template>
  <ElForm :validation-schema="validationSchema">
    <TElInput v-model="user.name" name="name" class="mb-10" label="name" />
    <TElInput v-model="user.type" name="type" label="type" />
    <div v-if="attrs.haveButton" class="flex justify-end gap-1 pt-3">
      <ElButton class="btn btn-gray-1" @click="emit('closed')">{{
        $t('common.utilities.button.cancel')
      }}</ElButton>
      <ElButton class="btn btn-primary" @click="onSubmit()">{{
        $t('common.utilities.button.confirm')
      }}</ElButton>
    </div>
  </ElForm>
</template>

<script setup>
import { object, string } from 'yup'
import { useTForm } from './_useTForm'

const emit = defineEmits(['update:TForm', 'confirm', 'exposeSubmit', 'closed'])

const attrs = useAttrs()

const user = reactive({
  name: '',
  type: '',
})
// form rule schema
const validationSchema = object({
  name: string().required(),
  type: string().required(),
})

const { onSubmit } = useTForm(user, emit, validationSchema)
</script>
