import { FormControl, FormLabel, Input, InputGroup, InputLeftAddon } from '@chakra-ui/react'
import { flowAtom } from '@globalStates/atoms'
import { __ } from '@helpers/i18nwrap'
import { useAtom } from 'jotai'

export default function Youtube() {
  const [flow, setFlow] = useAtom(flowAtom)

  const handleChanges = (value: string) => {
    setFlow(prev => {
      prev.config.unique_id = value
      prev.config.url = value === '' ? '' : `https://www.youtube.com/embed/${value}?autoplay=1`
    })
  }

  return (
    <FormControl>
      <FormLabel>{__('Video ID')}</FormLabel>
      <InputGroup>
        {/* eslint-disable-next-line i18next/no-literal-string */}
        <InputLeftAddon>youtube.com/watch?v=</InputLeftAddon>
        <Input onChange={e => handleChanges(e.target.value)} value={flow.config?.unique_id || ''} />
      </InputGroup>
    </FormControl>
  )
}
