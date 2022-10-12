import { Box, useToast } from '@chakra-ui/react'
import Title from '@components/global/Title'
import { TColor } from '@atomik-color/core/dist/types'
import { useAtom } from 'jotai'
import { widgetAtom } from '@globalStates/atoms'
import useUpdateWidget from '@hooks/mutations/widget/useUpdateWidget'
import useToaster from '@hooks/useToaster'
import { useRef } from 'react'
import ColorPickerWrap from '@components/global/ColorPickerWrap'

function WidgetColor() {
  const [widget, setWidget] = useAtom(widgetAtom)
  const { updateWidget } = useUpdateWidget()
  const colorChangedRef = useRef<boolean>(false)
  const toaster = useToaster()

  const handleClose = async () => {
    if (!colorChangedRef.current) return
    colorChangedRef.current = false

    const { status, data } = await updateWidget(widget)
    toaster(status, data)
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
