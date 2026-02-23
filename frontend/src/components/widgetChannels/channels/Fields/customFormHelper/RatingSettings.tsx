import { Radio, RadioGroup, Stack } from '@chakra-ui/react'
import { __ } from '@helpers/i18nwrap'

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
          {__('Star')}
        </Radio>
        <Radio value="smiley">{__('Smiley')}</Radio>
      </Stack>
    </RadioGroup>
  )
}
