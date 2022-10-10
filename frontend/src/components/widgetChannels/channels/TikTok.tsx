/* eslint-disable react/no-children-prop */
import { FormControl, FormLabel, Input, InputGroup, InputLeftAddon, Textarea } from '@chakra-ui/react'
import { flowAtom } from '@globalStates/atoms'
import { useAtom } from 'jotai'
import OpenWindowAction from '@components/widgetChannels/channels/OpenWindowAction'

const TikTok = () => {
  const [flow, setFlow] = useAtom(flowAtom)

  const handleChanges = (value: string | number | boolean, key: string) => {
    setFlow((prev) => {
      prev.config[key] = value

      if (key === 'unique_id') {
        prev.config.url = `https://www.tiktok.com/@${value}`
      }
    })
  }

  return (
    <>
      <FormControl>
        <FormLabel htmlFor="unique_id">Username</FormLabel>
        <InputGroup>
          <InputLeftAddon children="@" />
          <Input id="unique_id" value={flow.config?.unique_id ?? ''} onChange={(e) => handleChanges(e.target.value, 'unique_id')} />
        </InputGroup>
      </FormControl>
      <OpenWindowAction value={flow.config?.open_window_action ?? ''} handleChanges={handleChanges} />
    </>
  )
}

export default TikTok
