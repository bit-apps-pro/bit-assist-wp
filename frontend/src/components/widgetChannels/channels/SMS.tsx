/* eslint-disable unicorn/filename-case */
import { FormControl, FormLabel, Input } from '@chakra-ui/react'
import { flowAtom } from '@globalStates/atoms'
import { __ } from '@wordpress/i18n'
import { useAtom } from 'jotai'

export default function SMS() {
  const [flow, setFlow] = useAtom(flowAtom)

  const handleChanges = (value: string) => {
    setFlow(prev => {
      prev.config.unique_id = value
      prev.config.url = `sms:${value}`
    })
  }

  return (
    <FormControl>
      <FormLabel>{__('Phone number', 'bit-assist')}</FormLabel>
      <Input onChange={e => handleChanges(e.target.value)} value={flow.config?.unique_id || ''} />
    </FormControl>
  )
}
