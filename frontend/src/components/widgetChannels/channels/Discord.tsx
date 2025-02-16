import { FormControl, FormLabel, Input, InputGroup, InputLeftAddon } from '@chakra-ui/react'
import OpenWindowAction from '@components/widgetChannels/channels/OpenWindowAction'
import { flowAtom } from '@globalStates/atoms'
import { useAtom } from 'jotai'

export default function Discord() {
  const [flow, setFlow] = useAtom(flowAtom)

  const handleChanges = (value: string) => {
    setFlow(prev => {
      prev.config.unique_id = value
      prev.config.url = `https://discord.gg/${value}`
    })
  }

  return (
    <>
      <FormControl>
        <FormLabel>Discord invite code</FormLabel>
        <InputGroup>
          <InputLeftAddon>discord.gg/</InputLeftAddon>
          <Input onChange={e => handleChanges(e.target.value)} value={flow.config?.unique_id || ''} />
        </InputGroup>
      </FormControl>
      <OpenWindowAction />
    </>
  )
}
