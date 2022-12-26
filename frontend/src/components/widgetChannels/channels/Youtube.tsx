import { FormControl, FormLabel, Input, InputGroup, InputLeftAddon } from '@chakra-ui/react'
import { flowAtom } from '@globalStates/atoms'
import { useAtom } from 'jotai'

function Youtube() {
  const [flow, setFlow] = useAtom(flowAtom)

  const handleChanges = (value: string | number | boolean, key: string) => {
    setFlow((prev) => {
      prev.config = { ...prev.config, [key]: value }

      if (key === 'unique_id') {
        prev.config.url = value !== '' ? `https://www.youtube.com/embed/${value}?autoplay=1` : ''
      }
    })
  }

  return (
    <FormControl>
      <FormLabel>Youtube video id</FormLabel>
      <InputGroup>
        <InputLeftAddon children="youtube.com/watch?v=" />
        <Input value={flow.config?.unique_id ?? ''} onChange={(e) => handleChanges(e.target.value, 'unique_id')} />
      </InputGroup>
    </FormControl>
  )
}

export default Youtube
