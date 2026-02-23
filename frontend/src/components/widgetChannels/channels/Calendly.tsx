import { FormControl, FormLabel, Input, InputGroup, InputLeftAddon } from '@chakra-ui/react'
import OpenWindowAction from '@components/widgetChannels/channels/OpenWindowAction'
import { flowAtom } from '@globalStates/atoms'
import { __ } from '@helpers/i18nwrap'
import { useAtom } from 'jotai'

export default function Calendly() {
  const [flow, setFlow] = useAtom(flowAtom)

  const handleChanges = (value: string) => {
    setFlow(prev => {
      prev.config.unique_id = value
      prev.config.url = `https://calendly.com/${value}`
    })
  }

  return (
    <>
      <FormControl>
        <FormLabel>{__('Link')}</FormLabel>
        <InputGroup>
          {/* eslint-disable-next-line i18next/no-literal-string */}
          <InputLeftAddon>calendly.com/</InputLeftAddon>
          <Input
            onChange={e => handleChanges(e.target.value)}
            placeholder={__('booking link')}
            value={flow.config?.unique_id || ''}
          />
        </InputGroup>
      </FormControl>
      <OpenWindowAction />
    </>
  )
}
