import { FormControl, FormLabel, Input } from '@chakra-ui/react'
import OpenWindowAction from '@components/widgetChannels/channels/OpenWindowAction'
import { flowAtom } from '@globalStates/atoms'
import { useAtom } from 'jotai'

export default function CustomChannel() {
  const [flow, setFlow] = useAtom(flowAtom)

  const handleChanges = (value: string) => {
    setFlow(prev => {
      prev.config.unique_id = value
      prev.config.url = value
    })
  }

  return (
    <>
      <FormControl>
        <FormLabel>Custom channel link</FormLabel>
        <Input
          onChange={e => handleChanges(e.target.value)}
          placeholder="https://..."
          value={flow.config?.unique_id ?? ''}
        />
      </FormControl>
      <OpenWindowAction />
    </>
  )
}
