import { FormControl, FormLabel, Input } from '@chakra-ui/react'
import { flowAtom } from '@globalStates/atoms'
import { __ } from '@wordpress/i18n'
import { useAtom } from 'jotai'

import OpenWindowAction from './OpenWindowAction'

export default function Signal() {
  const [flow, setFlow] = useAtom(flowAtom)

  const handleChanges = (value: string) => {
    setFlow(prev => {
      prev.config.unique_id = value
      prev.config.url = `https://signal.me/#p/${value}`
    })
  }

  return (
    <>
      <FormControl>
        <FormLabel>{__('Phone number', 'bit-assist')}</FormLabel>
        <Input onChange={e => handleChanges(e.target.value)} value={flow.config?.unique_id || ''} />
      </FormControl>
      <OpenWindowAction />
    </>
  )
}
