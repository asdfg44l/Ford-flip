import type { FormItemProps } from 'element-plus'

export interface FormItems extends Partial<FormItemProps> {
  class?: string | Record<string, any> | Array<string>
}
