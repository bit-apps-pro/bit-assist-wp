import { FormControl, FormLabel, Input, InputGroup, InputLeftAddon } from '@chakra-ui/react'
import OpenWindowAction from '@components/widgetChannels/channels/OpenWindowAction'
import { flowAtom } from '@globalStates/atoms'
import { __ } from '@wordpress/i18n'
import { useAtom } from 'jotai'

export default function Tidycal() {
  const [flow, setFlow] = useAtom(flowAtom)

  const handleChanges = (value: string) => {
    setFlow(prev => {
      prev.config.unique_id = value
      prev.config.url = `https://tidycal.com/${value}`
    })
  }

  return (
    <>
      <FormControl>
        <FormLabel>{__('Link', 'bit-assist')}</FormLabel>
        <InputGroup>
          {/* eslint-disable-next-line i18next/no-literal-string */}
          <InputLeftAddon>tidycal.com/</InputLeftAddon>
          <Input
            onChange={e => handleChanges(e.target.value)}
            placeholder={__('booking link', 'bit-assist')}
            value={flow.config?.unique_id || ''}
          />
        </InputGroup>
      </FormControl>

      <OpenWindowAction />
    </>
  )
}
