import { FormControl, FormLabel, Input, InputGroup, InputLeftAddon } from '@chakra-ui/react'
import { flowAtom } from '@globalStates/atoms'
import { useAtom } from 'jotai'
import OpenWindowAction from '@components/widgetChannels/channels/OpenWindowAction'

export default function Calendly() {
  const [flow, setFlow] = useAtom(flowAtom)

  const handleChanges = (value: string) => {
    setFlow((prev) => {
      prev.config.unique_id = value
      prev.config.url = `https://calendly.com/${value}`
    })
  }

  return (
    <>
      <FormControl>
        <FormLabel>Calendly </FormLabel>
        <InputGroup>
          <InputLeftAddon children="calendly.com/" />
          <Input
            value={flow.config?.unique_id || ''}
            onChange={(e) => handleChanges(e.target.value)}
            placeholder="calendly-link-name"
          />
        </InputGroup>
      </FormControl>
      <OpenWindowAction />
    </>
  )
}
