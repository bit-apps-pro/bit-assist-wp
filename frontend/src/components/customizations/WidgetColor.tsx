import { Box, useToast } from '@chakra-ui/react'
import Title from '@components/global/Title'
import { TColor } from '@atomik-color/core/dist/types'
import { useAtom } from 'jotai'
import { widgetAtom } from '@globalStates/atoms'
import useUpdateWidget from '@hooks/mutations/widget/useUpdateWidget'
import ResponseToast from '@components/global/ResponseToast'
import { useRef } from 'react'
import ColorPickerWrap from '@components/global/ColorPickerWrap'

const WidgetColor = () => {
  const toast = useToast({ isClosable: true })
  const [widget, setWidget] = useAtom(widgetAtom)
  const { updateWidget } = useUpdateWidget()
  const colorChangedRef = useRef<boolean>(false)

  const handleClose = async () => {
    if (!colorChangedRef.current) return
    colorChangedRef.current = false

    const response: any = await updateWidget(widget)
    ResponseToast({ toast, response, action: 'update', messageFor: 'Widget color' })
  }

  const handleColorChange = (color: TColor) => {
    colorChangedRef.current = true
    setWidget((prev) => {
      if (prev.styles === null) {
        prev.styles = {}
      }
      prev.styles.color = color
    })
  }

  return (
    <Box>
      <Title>Widget Color</Title>
      <ColorPickerWrap color={widget.styles?.color} handleChange={handleColorChange} handleClose={handleClose} />
    </Box>
  )
}

export default WidgetColor
