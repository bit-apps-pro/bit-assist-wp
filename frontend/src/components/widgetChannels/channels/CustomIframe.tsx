import { FormControl, FormHelperText, FormLabel, Input } from '@chakra-ui/react'
import { flowAtom } from '@globalStates/atoms'
import { useAtom } from 'jotai'

export default function CustomIframe() {
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
        <FormLabel>iFrame url</FormLabel>
        <Input
          value={flow.config?.unique_id || ''}
          onChange={(e) => handleChanges(e.target.value)}
          placeholder="https://..."
        />
        <FormHelperText>
          Don't directly use iFrame tag, only use <b>URL</b> from iFrame.
        </FormHelperText>
      </FormControl>
    </>
  )
}
