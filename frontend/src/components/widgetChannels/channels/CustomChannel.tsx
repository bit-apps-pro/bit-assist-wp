import { FormControl, FormLabel, Input } from '@chakra-ui/react'
import { flowAtom } from '@globalStates/atoms'
import { useAtom } from 'jotai'
import OpenWindowAction from '@components/widgetChannels/channels/OpenWindowAction'

export default function CustomChannel() {
  const [flow, setFlow] = useAtom(flowAtom)

  const handleChanges = (value: string | number | boolean, key: string) => {
    setFlow((prev) => {
      prev.config = { ...prev.config, [key]: value }

      if (key === 'unique_id') {
        prev.config.url = value.toString()
      }
    })
  }

  return (
    <>
      <FormControl>
        <FormLabel>Custom channel link</FormLabel>
        <Input
          value={flow.config?.unique_id ?? ''}
          onChange={(e) => handleChanges(e.target.value, 'unique_id')}
          placeholder="https://..."
        />
      </FormControl>
      <OpenWindowAction value={flow.config?.open_window_action ?? ''} handleChanges={handleChanges} />
    </>
  )
}
