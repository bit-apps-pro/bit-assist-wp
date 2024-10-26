import { Radio, RadioGroup, Stack } from '@chakra-ui/react'

type RatingSettingsProps = {
  id: number
  type: string | undefined
  handleChange: (value: string | boolean | number, key: string, index: number) => void
}

export default function RatingSettings({ id, type, handleChange }: RatingSettingsProps) {
  return (
    <RadioGroup colorScheme="purple" value={type} onChange={(val) => handleChange(val, 'rating_type', id)}>
      <Stack spacing={4} direction={'row'}>
        <Radio value="star" isRequired>
          Star
        </Radio>
        <Radio value="smiley">Smiley</Radio>
      </Stack>
    </RadioGroup>
  )
}
