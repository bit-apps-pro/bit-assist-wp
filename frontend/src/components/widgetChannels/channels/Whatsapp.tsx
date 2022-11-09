import { FormControl, FormLabel, Input, Textarea } from '@chakra-ui/react'
import { flowAtom } from '@globalStates/atoms'
import { useAtom } from 'jotai'
import OpenWindowAction from '@components/widgetChannels/channels/OpenWindowAction'
import { useEffect } from 'react'

function Whatsapp() {
  const [flow, setFlow] = useAtom(flowAtom)

  const handleChanges = (value: string | number | boolean, key: string) => {
    setFlow((prev) => {
      prev.config = { ...prev.config, [key]: value }
    })
  }

  useEffect(() => {
    setFlow((prev) => {
      prev.config.url = `https://api.whatsapp.com/send/?phone=${flow.config?.unique_id ?? ''}&text=${flow.config?.message ?? ''}`
    })
  }, [flow.config?.unique_id, flow.config?.message])

  return (
    <>
      <FormControl>
        <FormLabel>Phone number</FormLabel>
        <Input value={flow.config?.unique_id ?? ''} onChange={(e) => handleChanges(e.target.value, 'unique_id')} placeholder="ex: 88012312312312" />
      </FormControl>
      <FormControl>
        <FormLabel>Message</FormLabel>
        <Textarea value={flow.config?.message ?? ''} onChange={(e) => handleChanges(e.target.value, 'message')} />
      </FormControl>
      <OpenWindowAction value={flow.config?.open_window_action ?? ''} handleChanges={handleChanges} />
    </>
  )
}

export default Whatsapp
