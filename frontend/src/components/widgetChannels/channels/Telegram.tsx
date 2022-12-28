import { FormControl, FormLabel, Input } from '@chakra-ui/react'
import { flowAtom } from '@globalStates/atoms'
import { useAtom } from 'jotai'
import OpenWindowAction from '@components/widgetChannels/channels/OpenWindowAction'

export default function Telegram() {
  const [flow, setFlow] = useAtom(flowAtom)

  const handleChanges = (value: string) => {
    setFlow((prev) => {
      prev.config.unique_id = value
      prev.config.url = `https://telegram.me/${value}`
    })
  }

  return (
    <>
      <FormControl>
        <FormLabel>Username</FormLabel>
        <Input value={flow.config?.unique_id || ''} onChange={(e) => handleChanges(e.target.value)} />
      </FormControl>
      <OpenWindowAction />
    </>
  )
}
