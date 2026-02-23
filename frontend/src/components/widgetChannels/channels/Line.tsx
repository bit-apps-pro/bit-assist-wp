import { FormControl, FormLabel, Input, InputGroup, InputLeftAddon } from '@chakra-ui/react'
import OpenWindowAction from '@components/widgetChannels/channels/OpenWindowAction'
import { flowAtom } from '@globalStates/atoms'
import { __ } from '@helpers/i18nwrap'
import { useAtom } from 'jotai'

export default function Line() {
  const [flow, setFlow] = useAtom(flowAtom)

  const handleChanges = (value: string) => {
    setFlow(prev => {
      prev.config.unique_id = value
      prev.config.url = `http://line.me/ti/p/${value}`
    })
  }

  return (
    <>
      <FormControl>
        <FormLabel>{__('Line ID')}</FormLabel>
        <InputGroup>
          <InputLeftAddon>@</InputLeftAddon>
          <Input onChange={e => handleChanges(e.target.value)} value={flow.config?.unique_id || ''} />
        </InputGroup>
      </FormControl>
      <OpenWindowAction />
    </>
  )
}
