import { Box, Switch, Text } from '@chakra-ui/react'
import Title from '@components/global/Title'
import { widgetAtom } from '@globalStates/atoms'
import useWidgetActive from '@hooks/mutations/widget/useWidgetActive'
import useToaster from '@hooks/useToaster'
import { __ } from '@wordpress/i18n'
import { useAtom } from 'jotai'

function Active() {
  const toaster = useToaster()
  const [widget, setWidget] = useAtom(widgetAtom)
  const { isWidgetActiveUpdating, updateWidgetActive } = useWidgetActive()

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target
    const { data, status } = await updateWidgetActive(widget.id, +checked)
    if (status === 'success') {
      setWidget(draft => {
        draft.active = checked
      })
    }
    toaster(status, data)
  }

  return (
    <Box>
      <Title>{__('Active Widget', 'bit-assist')}</Title>
      <Text mb="2">
        {__('Add this widget in your website', 'bit-assist')} ( {window.location.origin} )
      </Text>
      <Switch
        colorScheme="purple"
        disabled={isWidgetActiveUpdating}
        isChecked={widget.active}
        onChange={handleChange}
      />
    </Box>
  )
}

export default Active
