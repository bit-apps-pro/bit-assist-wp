import { Radio, RadioGroup, Stack } from '@chakra-ui/react'
import { __ } from '@wordpress/i18n'

interface RatingSettingsProps {
  handleChange: (value: boolean | number | string, key: string, index: number) => void
  id: number
  type: string | undefined
}

export default function RatingSettings({ handleChange, id, type }: RatingSettingsProps) {
  return (
    <RadioGroup colorScheme="purple" onChange={val => handleChange(val, 'rating_type', id)} value={type}>
      <Stack direction={'row'} spacing={4}>
        <Radio isRequired value="star">
          {__('Star', 'bit-assist')}
        </Radio>
        <Radio value="smiley">{__('Smiley', 'bit-assist')}</Radio>
      </Stack>
    </RadioGroup>
  )
}
