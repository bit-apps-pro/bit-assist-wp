import { FormControl, FormLabel, Select } from '@chakra-ui/react'
import { flowAtom } from '@globalStates/atoms'
import { __ } from '@helpers/i18nwrap'
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
      <FormLabel>{__('On click open channel on')}</FormLabel>
      <Select
        onChange={e => handleChanges(e.target.value)}
        placeholder={__('Select window action')}
        value={flow.config?.open_window_action || ''}
      >
        <option value="_blank">{__('New Tab')}</option>
        <option value="_parent">{__('Current Tab')}</option>
        <option value="new_window">{__('New Window')}</option>
      </Select>
    </FormControl>
  )
}
