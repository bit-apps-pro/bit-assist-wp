import { Box, Input } from '@chakra-ui/react'
import useUpdateWidget from '@hooks/mutations/widget/useUpdateWidget'
import Title from '@components/global/Title'
import { useToast } from '@chakra-ui/react'
import { useAtom } from 'jotai'
import { widgetAtom } from '@globalStates/atoms'
import { debounce } from 'lodash'
import { useEffect, useRef } from 'react'
import ResponseToast from '@components/global/ResponseToast'

const WidgetName = () => {
  const toast = useToast({ isClosable: true })
  const [widget, setWidget] = useAtom(widgetAtom)
  const { updateWidget, isWidgetUpdating } = useUpdateWidget()

  const debounceUpdateWidget = useRef(
    debounce(async (newWidget) => {
      const response: any = await updateWidget(newWidget)
      ResponseToast({
        toast,
        response,
        action: 'update',
        messageFor: 'Widget name',
      })
    }, 1000),
  ).current

  useEffect(() => {
    return () => {
      debounceUpdateWidget.cancel()
    }
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
      <Input maxW="lg" placeholder="Widget Name" value={widget.name || ''} onChange={handleChange} isRequired={true} />
    </Box>
  )
}

export default WidgetName
