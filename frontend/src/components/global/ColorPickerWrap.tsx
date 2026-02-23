import ColorPicker from '@atomik-color/component'
import { type TColor } from '@atomik-color/core/dist/types'
import { Button, Popover, PopoverBody, PopoverContent, PopoverTrigger } from '@chakra-ui/react'
import { __ } from '@helpers/i18nwrap'

interface ColorPickerWrapProps {
  color: TColor | undefined
  handleChange: (color: TColor) => void
  handleClose: () => void
}

function ColorPickerWrap({ color, handleChange, handleClose }: ColorPickerWrapProps) {
  return (
    <Popover onClose={handleClose} placement="right">
      <PopoverTrigger>
        <Button
          _focus={{ backgroundColor: color?.str, boxShadow: 'outline' }}
          _hover={{ backgroundColor: color?.str }}
          aria-label={__('Color picker')}
          bgColor={color?.str}
          boxShadow="md"
          h="14"
          rounded="md"
          transition="none"
          w="14"
        />
      </PopoverTrigger>
      <PopoverContent border="0" rounded="sm" w="242px">
        <PopoverBody maxW="100%" p="0">
          <ColorPicker onChange={handleChange} showParams showPreview={false} value={color} />
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

export default ColorPickerWrap
