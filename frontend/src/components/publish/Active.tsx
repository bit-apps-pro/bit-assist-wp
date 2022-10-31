import { Box, Switch, Text } from '@chakra-ui/react'
import useToaster from '@hooks/useToaster'
import { widgetAtom } from '@globalStates/atoms'
import { useAtom } from 'jotai'
import Title from '@components/global/Title'
import useWidgetActive from '@hooks/mutations/widget/useWidgetActive'

function Active() {
  const toaster = useToaster()
  const [widget, setWidget] = useAtom(widgetAtom)
  const { updateWidgetActive, isWidgetActiveUpdating } = useWidgetActive()

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target
    const { status, data } = await updateWidgetActive(widget.id, +checked)
    if (status === 'success') {
      setWidget((draft) => { draft.active = checked })
    }
    toaster(status, data)
  }

  return (
    <Box>
      <Title>Active Widget</Title>
      <Text mb="2">
        Add this widget in your website (
        {' '}
        {window.location.origin}
        {' '}
        )
      </Text>
      <Switch colorScheme="purple" isChecked={widget.active} onChange={handleChange} disabled={isWidgetActiveUpdating} />
    </Box>
  )
}

export default Active
