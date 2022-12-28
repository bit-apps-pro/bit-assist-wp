import { FormControl, FormLabel, Input, InputGroup, InputLeftAddon } from '@chakra-ui/react'
import { flowAtom } from '@globalStates/atoms'
import { useAtom } from 'jotai'

export default function Youtube() {
  const [flow, setFlow] = useAtom(flowAtom)

  const handleChanges = (value: string) => {
    setFlow((prev) => {
      prev.config.unique_id = value
      prev.config.url = value !== '' ? `https://www.youtube.com/embed/${value}?autoplay=1` : ''
    })
  }

  return (
    <FormControl>
      <FormLabel>Youtube video id</FormLabel>
      <InputGroup>
        <InputLeftAddon children="youtube.com/watch?v=" />
        <Input value={flow.config?.unique_id || ''} onChange={(e) => handleChanges(e.target.value)} />
      </InputGroup>
    </FormControl>
  )
}
