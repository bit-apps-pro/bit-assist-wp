import { Box, Input } from '@chakra-ui/react'
import useUpdateWidget from '@hooks/mutations/widget/useUpdateWidget'
import Title from '@components/global/Title'
import { useAtom } from 'jotai'
import { widgetAtom } from '@globalStates/atoms'
import { debounce } from 'lodash'
import { useEffect, useRef } from 'react'
import useToaster from '@hooks/useToaster'

function WidgetName() {
  const [widget, setWidget] = useAtom(widgetAtom)
  const { updateWidget } = useUpdateWidget()
  const toaster = useToaster()

  const debounceUpdateWidget = useRef(
    debounce(async (newWidget) => {
      const { status, data } = await updateWidget(newWidget)
      toaster(status, data)
    }, 1000),
  ).current

  useEffect(() => () => {
    debounceUpdateWidget.cancel()
  }, [debounceUpdateWidget])

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setWidget((draft) => {
      draft.name = e.target.value
    })
    debounceUpdateWidget({ ...widget, name: e.target.value })
  }

  return (
    <Box>
      <Title>Widget Name</Title>
      <Input maxW="lg" placeholder="Widget Name" value={widget.name || 'Untitled Widget'} onChange={handleChange} isRequired />
    </Box>
  )
}

export default WidgetName
