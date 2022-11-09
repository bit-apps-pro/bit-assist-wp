import { FormControl, FormLabel, Select } from '@chakra-ui/react'

interface OpenWindowActionProps {
  value: string
  handleChanges: (value: string | number | boolean, key: string) => void
}

function OpenWindowAction({ value, handleChanges }: OpenWindowActionProps) {
  return (
    <FormControl>
      <FormLabel>On click open channel on</FormLabel>
      <Select placeholder="Select window action" value={value} onChange={(e) => handleChanges(e.target.value, 'open_window_action')}>
        <option value="_blank">New Tab</option>
        <option value="_parent">Current Tab</option>
        <option value="new_window">New Window</option>
      </Select>
    </FormControl>
  )
}

export default OpenWindowAction
