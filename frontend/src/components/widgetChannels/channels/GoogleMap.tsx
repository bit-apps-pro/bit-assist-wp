import { FormControl, FormLabel, Textarea } from '@chakra-ui/react'
import { flowAtom } from '@globalStates/atoms'
import { useAtom } from 'jotai'

function GoogleMap() {
  const [flow, setFlow] = useAtom(flowAtom)

  const handleChanges = (value: string | number | boolean, key: string) => {
    setFlow((prev) => {
      prev.config = { ...prev.config, [key]: value }
    })
  }

  return (
    <FormControl>
      <FormLabel>Google maps embed code</FormLabel>
      <Textarea value={flow.config?.unique_id ?? ''} onChange={(e) => handleChanges(e.target.value, 'unique_id')} />
    </FormControl>
  )
}

export default GoogleMap
