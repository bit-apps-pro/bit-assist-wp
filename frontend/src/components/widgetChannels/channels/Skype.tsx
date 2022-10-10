import { FormControl, FormLabel, Input, Text } from '@chakra-ui/react'
import { flowAtom } from '@globalStates/atoms'
import { useAtom } from 'jotai'
import OpenWindowAction from '@components/widgetChannels/channels/OpenWindowAction'

const Skype = () => {
  const [flow, setFlow] = useAtom(flowAtom)

  const handleChanges = (value: string | number | boolean, key: string) => {
    setFlow((prev) => {
      prev.config[key] = value

      if (key === 'unique_id' || key === 'phone_number') {
        prev.config.url = `skype:${value || (key === 'unique_id' ? prev.config?.phone_number : prev.config?.unique_id)}?chat`
      }
    })
  }

  return (
    <>
      <FormControl>
        <FormLabel htmlFor="unique_id">Skype username</FormLabel>
        <Input id="unique_id" value={flow.config?.unique_id ?? ''} onChange={(e) => handleChanges(e.target.value, 'unique_id')} />
      </FormControl>

      <Text> -Or- </Text>

      <FormControl>
        <FormLabel htmlFor="phone_number">(Skype) Phone number</FormLabel>
        <Input id="phone_number" type="tel" value={flow.config?.phone_number ?? ''} onChange={(e) => handleChanges(e.target.value, 'phone_number')} />
      </FormControl>
      <OpenWindowAction value={flow.config?.open_window_action ?? ''} handleChanges={handleChanges} />
    </>
  )
}

export default Skype
