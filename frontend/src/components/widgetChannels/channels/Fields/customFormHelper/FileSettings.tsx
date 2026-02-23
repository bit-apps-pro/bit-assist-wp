import { FormControl, FormLabel, Switch, VStack } from '@chakra-ui/react'
import { type DynamicFormField } from '@globalStates/Interfaces'
import { __ } from '@helpers/i18nwrap'

interface FileSettingsProps {
  field: DynamicFormField | undefined
  handleChange: (value: boolean | number | string, key: string, index: number) => void
  id: number
}

export default function FileSettings({ field, handleChange, id }: FileSettingsProps) {
  return (
    <VStack alignItems={'flex-start'} w="full">
      <FormControl alignItems="center" display="flex">
        <FormLabel fontSize={'sm'} mb="0">
          {__('Allow Multiple')}
        </FormLabel>
        <Switch
          colorScheme="purple"
          isChecked={!!field?.allow_multiple}
          onChange={e => handleChange(e.target.checked, 'allow_multiple', id)}
        />
      </FormControl>
      {/* <FormControl display="flex" alignItems="center">
        <FormLabel mb="0" fontSize={'sm'} whiteSpace="nowrap">Max Upload Size</FormLabel>
        <Input placeholder='Any Size' value={field?.max_upload_size} onChange={(e) => handleChange(e.target.value, 'max_upload_size', id)} />
      </FormControl> */}
      {/* <FormControl display="flex" alignItems="center">
        <FormLabel mb="0" fontSize={'sm'} whiteSpace="nowrap">Allowed File Type</FormLabel>
      </FormControl> */}
    </VStack>
  )
}
