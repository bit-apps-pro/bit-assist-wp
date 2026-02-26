import { FormControl, FormLabel, Select } from '@chakra-ui/react'
import { flowAtom } from '@globalStates/atoms'
import { __ } from '@wordpress/i18n'
import { useAtom } from 'jotai'

export default function OpenWindowAction() {
  const [flow, setFlow] = useAtom(flowAtom)

  const handleChanges = (value: string) => {
    setFlow(prev => {
      prev.config.open_window_action = value
    })
  }

  return (
    <FormControl>
      <FormLabel>{__('On click open channel on', 'bit-assist')}</FormLabel>
      <Select
        onChange={e => handleChanges(e.target.value)}
        placeholder={__('Select window action', 'bit-assist')}
        value={flow.config?.open_window_action || ''}
      >
        <option value="_blank">{__('New Tab', 'bit-assist')}</option>
        <option value="_parent">{__('Current Tab', 'bit-assist')}</option>
        <option value="new_window">{__('New Window', 'bit-assist')}</option>
      </Select>
    </FormControl>
  )
}
