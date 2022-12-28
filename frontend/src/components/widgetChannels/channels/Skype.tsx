import { FormControl, FormLabel, Input, Text } from '@chakra-ui/react'
import { flowAtom } from '@globalStates/atoms'
import { useAtom } from 'jotai'
import OpenWindowAction from '@components/widgetChannels/channels/OpenWindowAction'

export default function Skype() {
  const [flow, setFlow] = useAtom(flowAtom)

  const handleChanges = (value: string | number | boolean, key: string) => {
    setFlow((prev) => {
      prev.config = { ...prev.config, [key]: value }

      if (key === 'unique_id' || key === 'phone_number') {
        prev.config.url = `skype:${
          value || (key === 'unique_id' ? prev.config?.phone_number : prev.config?.unique_id)
        }?chat`
      }
    })
  }

  return (
    <>
      <FormControl>
        <FormLabel>Skype username</FormLabel>
        <Input value={flow.config?.unique_id ?? ''} onChange={(e) => handleChanges(e.target.value, 'unique_id')} />
      </FormControl>

      <Text> -Or- </Text>

      <FormControl>
        <FormLabel>(Skype) Phone number</FormLabel>
        <Input
          value={flow.config?.phone_number ?? ''}
          onChange={(e) => handleChanges(e.target.value, 'phone_number')}
        />
      </FormControl>
      <OpenWindowAction />
    </>
  )
}
