import { watch, Ref } from 'vue'
import { useField } from 'vee-validate'

interface InputProps {
  modelValue: Ref<any>;
  name: Ref<string>;
  rules?: Ref<any>;
}

export function useTInput(emit: Function, { modelValue, name, rules }: InputProps) {
  const { value, errorMessage, handleBlur, validate, meta } = useField(
    name.value,
    rules?.value,
    {
      initialValue: modelValue.value,
      validateOnValueUpdate: false,
    }
  )

  watch(
    () => modelValue.value,
    (val) => {
      console.log('inner modelValue', val)
      value.value = val
    }
  )

  // watch(
  //   () => value.value,
  //   (val) => emit('update:modelValue', val)
  // )
  return { value, errorMessage, handleBlur, validate, meta }
} 