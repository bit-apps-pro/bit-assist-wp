import { type TColor } from '@atomik-color/core/dist/types'
import { Box } from '@chakra-ui/react'
import ColorPickerWrap from '@components/global/ColorPickerWrap'
import Title from '@components/global/Title'
import { widgetAtom } from '@globalStates/atoms'
import useUpdateWidget from '@hooks/mutations/widget/useUpdateWidget'
import useToaster from '@hooks/useToaster'
import { __ } from '@wordpress/i18n'
import { useAtom } from 'jotai'
import { useRef } from 'react'

function WidgetColor() {
  const [widget, setWidget] = useAtom(widgetAtom)
  const { updateWidget } = useUpdateWidget()
  const colorChangedRef = useRef<boolean>(false)
  const toaster = useToaster()

  const handleClose = async () => {
    if (!colorChangedRef.current) return
    colorChangedRef.current = false

    const { data, status } = await updateWidget(widget)
    toaster(status, data)
  }

  const handleColorChange = (color: TColor) => {
    colorChangedRef.current = true
    setWidget(prev => {
      if (prev.styles === null || prev.styles === undefined) {
        prev.styles = {}
      }
      prev.styles.color = color
    })
  }

  return (
    <Box>
      <Title>{__('Widget Color', 'bit-assist')}</Title>
      <ColorPickerWrap
        color={widget.styles?.color}
        handleChange={handleColorChange}
        handleClose={handleClose}
      />
    </Box>
  )
}

export default WidgetColor
