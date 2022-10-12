import { Box, Select } from '@chakra-ui/react'
import useToaster from '@hooks/useToaster'
import Title from '@components/global/Title'
import { widgetAtom } from '@globalStates/atoms'
import useUpdateWidget from '@hooks/mutations/widget/useUpdateWidget'
import { produce } from 'immer'
import { useAtom } from 'jotai'

function WidgetBehavior() {
  const toaster = useToaster()
  const [widget, setWidget] = useAtom(widgetAtom)
  const { updateWidget } = useUpdateWidget()

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value, 2)
    setWidget((prev) => {
      prev.widget_behavior = value
    })

    const { status, data } = await updateWidget(
      produce(widget, (draft) => {
        draft.widget_behavior = value
      }),
    )
    toaster(status, data)
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
