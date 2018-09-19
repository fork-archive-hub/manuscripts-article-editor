import { FieldProps } from 'formik'
import React from 'react'
import Select from 'react-select'
import { OptionsType } from 'react-select/lib/types'

interface OptionType {
  label: string
  value: any // tslint:disable-line:no-any
}

interface Props {
  options: OptionsType<OptionType>
}

export const SelectField: React.SFC<Props & FieldProps> = ({
  options,
  field,
  form,
}) => (
  <Select<OptionType>
    options={options}
    name={field.name}
    value={
      options ? options.find(option => option.value === field.value) : undefined
    }
    onChange={(option: OptionType) =>
      form.setFieldValue(field.name, option.value)
    }
    onBlur={field.onBlur}
  />
)
