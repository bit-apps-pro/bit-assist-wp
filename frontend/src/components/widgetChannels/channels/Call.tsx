import { FormControl, FormHelperText, FormLabel, Input, Textarea } from '@chakra-ui/react'
import { flowAtom } from '@globalStates/atoms'
import { useAtom } from 'jotai'

const Call = () => {
  const [flow, setFlow] = useAtom(flowAtom)

  const handleChanges = (value: string | number | boolean, key: string) => {
    setFlow((prev) => {
      prev.config[key] = value

      if (key === 'unique_id') {
        prev.config.url = `tel:${value}`
      }
    })
  }

  return (
    <>
      <FormControl>
        <FormLabel htmlFor="unique_id">Phone number</FormLabel>
        <Input id="unique_id" type="tel" value={flow.config?.unique_id ?? ''} onChange={(e) => handleChanges(e.target.value, 'unique_id')} />
      </FormControl>
    </>
  )
}

export default Call
