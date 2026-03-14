import { FormControl, FormLabel, Input, Textarea } from '@chakra-ui/react'
import OpenWindowAction from '@components/widgetChannels/channels/OpenWindowAction'
import { flowAtom } from '@globalStates/atoms'
import { __ } from '@wordpress/i18n'
import { useAtom } from 'jotai'
import { useEffect } from 'react'

function Whatsapp() {
  const [flow, setFlow] = useAtom(flowAtom)

  const handleChanges = (value: boolean | number | string, key: string) => {
    setFlow(prev => {
      prev.config = { ...prev.config, [key]: value }
    })
  }

  useEffect(() => {
    setFlow(prev => {
      prev.config.url = `https://api.whatsapp.com/send/?phone=${flow.config?.unique_id ?? ''}&text=${
        flow.config?.message ?? ''
      }`
    })
  }, [flow.config?.unique_id, flow.config?.message])

  return (
    <>
      <FormControl>
        <FormLabel>{__('Phone number', 'bit-assist')}</FormLabel>
        <Input
          onChange={e => handleChanges(e.target.value, 'unique_id')}
          placeholder={__('ex: 88012312312312', 'bit-assist')}
          value={flow.config?.unique_id ?? ''}
        />
      </FormControl>
      <FormControl>
        <FormLabel>{__('Message', 'bit-assist')}</FormLabel>
        <Textarea
          color="inherit"
          onChange={e => handleChanges(e.target.value, 'message')}
          value={flow.config?.message ?? ''}
        />
      </FormControl>
      <OpenWindowAction />
    </>
  )
}

export default Whatsapp
