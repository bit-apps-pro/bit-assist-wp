import { FormControl, FormLabel, Input } from '@chakra-ui/react'
import { flowAtom } from '@globalStates/atoms'
import { useAtom } from 'jotai'

export default function CustomIframe() {
  const [flow, setFlow] = useAtom(flowAtom)

  const handleChanges = (value: string, key: string) => {
    setFlow((prev) => {
      prev.config = { ...prev.config, [key]: value }

      if (key === 'unique_id') {
        prev.config.url = value
      }
    })
  }

  return (
    <>
      <FormControl>
        <FormLabel>iFrame url</FormLabel>
        <Input
          value={flow.config?.unique_id ?? ''}
          onChange={(e) => handleChanges(e.target.value, 'unique_id')}
          placeholder="https://..."
        />
      </FormControl>
    </>
  )
}
