import { FormControl, FormLabel, HStack, Input, Radio, RadioGroup, Stack, Switch, Text, VStack, } from '@chakra-ui/react'
import { DynamicFormField } from '@globalStates/Interfaces'

type FileSettingsProps = {
  id: number
  field: DynamicFormField | undefined
  handleChange: (value: string | boolean | number, key: string, index: number) => void
}

export default function FileSettings({ id, field, handleChange }: FileSettingsProps) {
  return (
    <VStack alignItems={'flex-start'} w='full'>
      <FormControl display="flex" alignItems="center">
        <FormLabel mb="0" fontSize={'sm'}>Allow Multiple</FormLabel>
        <Switch isChecked={!!field?.allow_multiple} colorScheme="purple" onChange={(e) => handleChange(e.target.checked, 'allow_multiple', id)} />
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