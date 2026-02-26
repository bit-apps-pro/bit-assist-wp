import { Box, Select } from '@chakra-ui/react'
import Title from '@components/global/Title'
import { widgetAtom } from '@globalStates/atoms'
import useUpdateWidget from '@hooks/mutations/widget/useUpdateWidget'
import useToaster from '@hooks/useToaster'
import { __ } from '@wordpress/i18n'
import { produce } from 'immer'
import { useAtom } from 'jotai'

function WidgetBehavior() {
  const toaster = useToaster()
  const [widget, setWidget] = useAtom(widgetAtom)
  const { updateWidget } = useUpdateWidget()

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(e.target.value)
    setWidget(prev => {
      prev.widget_behavior = value
    })

    const { data, status } = await updateWidget(
      produce(widget, draft => {
        draft.widget_behavior = value
      })
    )
    toaster(status, data)
  }

  return (
    <Box maxW="full" w="lg">
      <Title>{__('Widget Behavior', 'bit-assist')}</Title>
      <Select onChange={handleChange} value={widget.widget_behavior ?? ''}>
        <option value={1}>{__('Click to open', 'bit-assist')}</option>
        <option value={2}>{__('Hover to open', 'bit-assist')}</option>
        <option value={3}>{__('Opened by default', 'bit-assist')}</option>
      </Select>
    </Box>
  )
}

export default WidgetBehavior
