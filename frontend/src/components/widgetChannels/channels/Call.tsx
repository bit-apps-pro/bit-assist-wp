import { FormControl, FormLabel, Input } from '@chakra-ui/react'
import { flowAtom } from '@globalStates/atoms'
import { useAtom } from 'jotai'

export default function Call() {
  const [flow, setFlow] = useAtom(flowAtom)

  const handleChanges = (value: string) => {
    setFlow((prev) => {
      prev.config.unique_id = value
      prev.config.url = `tel:${value}`
    })
  }

  return (
    <FormControl>
      <FormLabel>Phone number</FormLabel>
      <Input value={flow.config?.unique_id || ''} onChange={(e) => handleChanges(e.target.value)} />
    </FormControl>
  )
}
