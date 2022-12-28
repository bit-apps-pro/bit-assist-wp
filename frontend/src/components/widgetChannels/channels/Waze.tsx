import { FormControl, FormLabel, Input } from '@chakra-ui/react'
import { flowAtom } from '@globalStates/atoms'
import { useAtom } from 'jotai'
import OpenWindowAction from '@components/widgetChannels/channels/OpenWindowAction'

export default function Waze() {
  const [flow, setFlow] = useAtom(flowAtom)

  const handleChanges = (value: string) => {
    setFlow((prev) => {
      prev.config.unique_id = value
      prev.config.url = value
    })
  }

  return (
    <>
      <FormControl>
        <FormLabel>Waze link</FormLabel>
        <Input value={flow.config?.unique_id || ''} onChange={(e) => handleChanges(e.target.value)} />
      </FormControl>
      <OpenWindowAction />
    </>
  )
}
