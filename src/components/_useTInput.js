import { watch } from 'vue'
import { useField } from 'vee-validate'

export function useTInput(emit, { modelValue, name, rules }) {
  const { value, errorMessage, handleBlur, validate, meta } = useField(
    name.value,
    rules.value,
    {
      initialValue: modelValue.value,
      validateOnValueUpdate: false,
    }
  )

  watch(
    () => modelValue.value,
    (val) => (value.value = val)
  )

  // watch(
  //   () => value.value,
  //   (val) => emit('update:modelValue', val)
  // )
  return { value, errorMessage, handleBlur, validate, meta }
}
