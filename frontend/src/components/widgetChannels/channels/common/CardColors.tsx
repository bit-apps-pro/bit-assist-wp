import { str2Color } from '@atomik-color/core'
import { type TColor } from '@atomik-color/core/dist/types'
import { FormControl, FormLabel, Stack } from '@chakra-ui/react'
import ColorPickerWrap from '@components/global/ColorPickerWrap'
import { flowAtom } from '@globalStates/atoms'
import { __ } from '@wordpress/i18n'
import { useAtom } from 'jotai'
import { useEffect } from 'react'

export default function CardColors({ bg, color }: { bg: string; color: string }) {
  const [flow, setFlow] = useAtom(flowAtom)

  useEffect(() => {
    if (flow.config?.card_config?.card_bg_color !== undefined) return
    setFlow(prev => {
      if (prev.config?.card_config === undefined) {
        prev.config.card_config = {}
      }
      prev.config.card_config.card_bg_color = str2Color(bg)
      prev.config.card_config.card_text_color = str2Color(color)
    })
  }, [])

  const handleColorChange = (color: TColor, key: string) => {
    setFlow(prev => {
      prev.config.card_config = { ...prev.config.card_config, [key]: color }
    })
  }

  return (
    <Stack flexDirection={['column', 'row']} gap="2" spacing="0" w="full">
      <FormControl>
        <FormLabel>{__('Form Theme Color', 'bit-assist')}</FormLabel>
        <ColorPickerWrap
          color={flow.config?.card_config?.card_bg_color}
          handleChange={(val: TColor) => handleColorChange(val, 'card_bg_color')}
          handleClose={() => {
            // Add meaningful implementation here if needed
          }}
        />
      </FormControl>

      <FormControl>
        <FormLabel>{__('Form Text Color', 'bit-assist')}</FormLabel>
        <ColorPickerWrap
          color={flow.config?.card_config?.card_text_color}
          handleChange={(val: TColor) => handleColorChange(val, 'card_text_color')}
          handleClose={() => {
            // Add meaningful implementation here if needed
          }}
        />
      </FormControl>
    </Stack>
  )
}
