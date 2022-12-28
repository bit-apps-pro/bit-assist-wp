import { FormControl, FormLabel, Textarea } from '@chakra-ui/react'
import { flowAtom } from '@globalStates/atoms'
import { useAtom } from 'jotai'

export default function GoogleMap() {
  const [flow, setFlow] = useAtom(flowAtom)

  const handleChanges = (value: string) => {
    setFlow((prev) => {
      prev.config.unique_id = value
    })
  }

  return (
    <FormControl>
      <FormLabel>Google maps embed code</FormLabel>
      <Textarea value={flow.config?.unique_id || ''} onChange={(e) => handleChanges(e.target.value)} />
    </FormControl>
  )
}
