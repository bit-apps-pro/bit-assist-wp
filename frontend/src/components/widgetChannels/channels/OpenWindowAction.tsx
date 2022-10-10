import { FormControl, FormLabel, Select } from '@chakra-ui/react'

const OpenWindowAction = ({ value, handleChanges }) => {
  return (
    <FormControl>
      <FormLabel htmlFor="open_window_action">On click open channel on</FormLabel>
      <Select id="open_window_action" placeholder="Select window action" value={value} onChange={(e) => handleChanges(e.target.value, 'open_window_action')}>
        <option value="_blank">New Tab</option>
        <option value="_parent">Current Tab</option>
        <option value="new_window">New Window</option>
      </Select>
    </FormControl>
  )
}

export default OpenWindowAction
