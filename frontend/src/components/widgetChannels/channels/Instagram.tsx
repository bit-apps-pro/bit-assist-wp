import { FormControl, FormLabel, Input } from '@chakra-ui/react'
import OpenWindowAction from '@components/widgetChannels/channels/OpenWindowAction'
import { flowAtom } from '@globalStates/atoms'
import { useAtom } from 'jotai'

export default function Instagram() {
  const [flow, setFlow] = useAtom(flowAtom)

  const handleChanges = (value: string) => {
    setFlow(prev => {
      prev.config.unique_id = value
      prev.config.url = `https://www.instagram.com/${value}`
    })
  }

  return (
    <>
      <FormControl>
        <FormLabel>Username</FormLabel>
        <Input onChange={e => handleChanges(e.target.value)} value={flow.config?.unique_id || ''} />
      </FormControl>
      <OpenWindowAction />
    </>
  )
}
