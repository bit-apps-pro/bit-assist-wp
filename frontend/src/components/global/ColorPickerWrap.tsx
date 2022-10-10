import { Button, Popover, PopoverBody, PopoverContent, PopoverTrigger } from '@chakra-ui/react'
import ColorPicker from '@atomik-color/component'

const ColorPickerWrap = ({ color, handleChange, handleClose = undefined }) => {
  return (
    <Popover onClose={handleClose} placement="right">
      <PopoverTrigger>
        <Button
          h="14"
          w="14"
          rounded="md"
          boxShadow="md"
          transition="none"
          bgColor={color?.str}
          aria-label="color picker"
          _hover={{ backgroundColor: color?.str }}
          _focus={{ boxShadow: 'outline', backgroundColor: color?.str }}
        />
      </PopoverTrigger>
      <PopoverContent border="0" w="242px" rounded={'sm'}>
        <PopoverBody p="0" maxW="100%">
          <ColorPicker showParams={true} showPreview={false} value={color} onChange={handleChange} />
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

export default ColorPickerWrap
