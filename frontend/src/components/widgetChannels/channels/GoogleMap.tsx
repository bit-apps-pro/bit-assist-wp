import { FormControl, FormLabel, Textarea } from '@chakra-ui/react'
import { flowAtom } from '@globalStates/atoms'
import { __ } from '@wordpress/i18n'
import { useAtom } from 'jotai'

export default function GoogleMap() {
  const [flow, setFlow] = useAtom(flowAtom)

  const handleChanges = (value: string) => {
    setFlow(prev => {
      prev.config.unique_id = value
    })
  }

  return (
    <FormControl>
      <FormLabel>{__('Embed code', 'bit-assist')}</FormLabel>
      <Textarea
        color="inherit"
        onChange={e => handleChanges(e.target.value)}
        value={flow.config?.unique_id || ''}
      />
    </FormControl>
  )
}
