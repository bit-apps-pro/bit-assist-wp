import { Box, Input } from '@chakra-ui/react'
import Title from '@components/global/Title'
import { widgetAtom } from '@globalStates/atoms'
import useUpdateWidget from '@hooks/mutations/widget/useUpdateWidget'
import useToaster from '@hooks/useToaster'
import { useAtom } from 'jotai'
import { debounce } from 'lodash'
import { useEffect, useRef } from 'react'

function WidgetName() {
  const [widget, setWidget] = useAtom(widgetAtom)
  const { updateWidget } = useUpdateWidget()
  const toaster = useToaster()

  const debounceUpdateWidget = useRef(
    debounce(async newWidget => {
      const { data, status } = await updateWidget(newWidget)
      toaster(status, data)
    }, 1000)
  ).current

  useEffect(
    () => () => {
      debounceUpdateWidget.cancel()
    },
    [debounceUpdateWidget]
  )

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setWidget(draft => {
      draft.name = e.target.value
    })
    debounceUpdateWidget({ ...widget, name: e.target.value })
  }

  return (
    <Box>
      <Title>Widget Name</Title>
      <Input
        isRequired
        maxW="lg"
        onChange={handleChange}
        placeholder="Widget Name"
        value={widget.name || 'Untitled Widget'}
      />
    </Box>
  )
}

export default WidgetName
