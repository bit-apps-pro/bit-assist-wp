import { FormControl, FormLabel, Input, InputGroup, InputLeftAddon } from '@chakra-ui/react'
import { flowAtom } from '@globalStates/atoms'
import { useAtom } from 'jotai'
import OpenWindowAction from '@components/widgetChannels/channels/OpenWindowAction'

export default function Tidycal() {
  const [flow, setFlow] = useAtom(flowAtom)

  const handleChanges = (value: string) => {
    setFlow((prev) => {
      prev.config.unique_id = value
      prev.config.url = `https://tidycal.com/${value}`
    })
  }

  return (
    <>
      <FormControl>
        <FormLabel>Tidycal</FormLabel>
        <InputGroup>
          <InputLeftAddon>tidycal.com/</InputLeftAddon>
          <Input
            value={flow.config?.unique_id || ''}
            onChange={(e) => handleChanges(e.target.value)}
            placeholder="booking link"
          />
        </InputGroup>
      </FormControl>

      <OpenWindowAction />
    </>
  )
}
