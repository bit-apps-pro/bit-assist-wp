import { Box, Select, useToast } from '@chakra-ui/react'
import ResponseToast from '@components/global/ResponseToast'
import Title from '@components/global/Title'
import { widgetAtom } from '@globalStates/atoms'
import useUpdateWidget from '@hooks/mutations/widget/useUpdateWidget'
import { produce } from 'immer'
import { useAtom } from 'jotai'

const WidgetBehavior = () => {
  const toast = useToast({ isClosable: true })
  const [widget, setWidget] = useAtom(widgetAtom)
  const { updateWidget, isWidgetUpdating } = useUpdateWidget()

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value)
    setWidget((prev) => {
      prev.widget_behavior = value
    })

    const response = await updateWidget(
      produce(widget, (draft) => {
        draft.widget_behavior = value
      })
    )
    ResponseToast({ toast, response, action: 'update', messageFor: 'Widget behavior' })
  }

  return (
    <Box w="lg" maxW="full">
      <Title>Widget Behavior</Title>
      <Select value={widget.widget_behavior ?? ''} onChange={handleChange}>
        <option value={1}>Click to open</option>
        {/* <option value={2}>Hover to open</option> */}
        <option value={3}>Opened by default</option>
      </Select>
    </Box>
  )
}

export default WidgetBehavior
