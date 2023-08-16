import { FormControl, FormLabel, Input } from '@chakra-ui/react'
import { flowAtom } from '@globalStates/atoms'
import { useAtom } from 'jotai'

function WPShortCode() {
  const [flow, setFlow] = useAtom(flowAtom)

  const handleChanges = (value: string | number | boolean, key: string) => {
    setFlow((prev) => {
      prev.config = { ...prev.config, [key]: value }
    })
  }

  return (
    <>
      <FormControl isRequired>
        <FormLabel>Wordpresss Shortcode</FormLabel>
        <Input
          value={flow.config?.unique_id ?? ''}
          onChange={(e) => handleChanges(e.target.value, 'unique_id')}
          placeholder="[bitform id='1']"
        />
      </FormControl>
    </>
  )
}

export default WPShortCode
