import { FormControl, FormLabel, Input, InputGroup, InputLeftAddon } from '@chakra-ui/react'
import OpenWindowAction from '@components/widgetChannels/channels/OpenWindowAction'
import { flowAtom } from '@globalStates/atoms'
import { __ } from '@wordpress/i18n'
import { useAtom } from 'jotai'

export default function Twitter() {
  const [flow, setFlow] = useAtom(flowAtom)

  const handleChanges = (value: string) => {
    setFlow(prev => {
      prev.config.unique_id = value
      prev.config.url = `https://twitter.com/${value}`
    })
  }

  return (
    <>
      <FormControl>
        <FormLabel>{__('User ID', 'bit-assist')}</FormLabel>
        <InputGroup>
          <InputLeftAddon>@</InputLeftAddon>
          <Input onChange={e => handleChanges(e.target.value)} value={flow.config?.unique_id || ''} />
        </InputGroup>
      </FormControl>
      <OpenWindowAction />
    </>
  )
}
