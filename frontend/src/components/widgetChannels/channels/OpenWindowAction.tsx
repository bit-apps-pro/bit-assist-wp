import { FormControl, FormLabel, Select } from '@chakra-ui/react'
import { flowAtom } from '@globalStates/atoms'
import { useAtom } from 'jotai'

export default function OpenWindowAction() {
  const [flow, setFlow] = useAtom(flowAtom)

  const handleChanges = (value: string) => {
    setFlow((prev) => {
      prev.config.open_window_action = value
    })
  }

  return (
    <FormControl>
      <FormLabel>On click open channel on</FormLabel>
      <Select
        placeholder="Select window action"
        value={flow.config?.open_window_action || ''}
        onChange={(e) => handleChanges(e.target.value)}
      >
        <option value="_blank">New Tab</option>
        <option value="_parent">Current Tab</option>
        <option value="new_window">New Window</option>
      </Select>
    </FormControl>
  )
}
