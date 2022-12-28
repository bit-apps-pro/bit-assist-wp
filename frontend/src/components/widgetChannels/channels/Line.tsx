import { FormControl, FormLabel, Input, InputGroup, InputLeftAddon } from '@chakra-ui/react'
import { flowAtom } from '@globalStates/atoms'
import { useAtom } from 'jotai'
import OpenWindowAction from '@components/widgetChannels/channels/OpenWindowAction'

export default function Line() {
  const [flow, setFlow] = useAtom(flowAtom)

  const handleChanges = (value: string) => {
    setFlow((prev) => {
      prev.config.unique_id = value
      prev.config.url = `http://line.me/ti/p/${value}`
    })
  }

  return (
    <>
      <FormControl>
        <FormLabel>Line ID</FormLabel>
        <InputGroup>
          <InputLeftAddon children="@" />
          <Input value={flow.config?.unique_id || ''} onChange={(e) => handleChanges(e.target.value)} />
        </InputGroup>
      </FormControl>
      <OpenWindowAction />
    </>
  )
}
