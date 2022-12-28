import { FormControl, FormLabel, Input } from '@chakra-ui/react'
import { flowAtom } from '@globalStates/atoms'
import { useAtom } from 'jotai'
import OpenWindowAction from '@components/widgetChannels/channels/OpenWindowAction'

export default function WeChat() {
  const [flow, setFlow] = useAtom(flowAtom)

  const handleChanges = (value: string) => {
    setFlow((prev) => {
      prev.config.unique_id = value
      prev.config.url = `weixin://dl/chat?${value}`
    })
  }

  return (
    <>
      <FormControl>
        <FormLabel>User Id</FormLabel>
        <Input value={flow.config?.unique_id || ''} onChange={(e) => handleChanges(e.target.value)} />
      </FormControl>
      <OpenWindowAction />
    </>
  )
}
