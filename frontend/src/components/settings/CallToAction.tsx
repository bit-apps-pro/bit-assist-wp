import { Box, Input, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Text, Tooltip, useColorModeValue, useToast, VStack } from '@chakra-ui/react'
import ResponseToast from '@components/global/ResponseToast'
import Title from '@components/global/Title'
import { widgetAtom } from '@globalStates/atoms'
import useUpdateWidget from '@hooks/mutations/widget/useUpdateWidget'
import { produce } from 'immer'
import { useAtom } from 'jotai'
import { debounce } from 'lodash'
import { useEffect, useRef, useState } from 'react'

const CallToAction = () => {
  const [showTooltip, setShowTooltip] = useState(false)
  const toast = useToast({ isClosable: true })
  const [widget, setWidget] = useAtom(widgetAtom)
  const { updateWidget } = useUpdateWidget()
  const brandColorToggle = useColorModeValue('purple.500', 'purple.200')
  const textColorToggle = useColorModeValue('white', 'gray.800')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateData(e.target.value, 'text')
  }

  const handleSliderChange = (val: number) => {
    updateData(val, 'delay')
  }

  const updateData = (val: string | number, key: string) => {
    setWidget((prev) => {
      if (prev.call_to_action === null) {
        prev.call_to_action = {}
      }
      prev.call_to_action[key] = val
    })

    debounceUpdateWidget(
      produce(widget, (draft) => {
        if (draft.call_to_action === null) {
          draft.call_to_action = {}
        }
        draft.call_to_action[key] = val
      })
    )
  }

  const debounceUpdateWidget = useRef(
    debounce(async (widget) => {
      const response: any = await updateWidget(widget)
      ResponseToast({ toast, response, action: 'update', messageFor: 'Widget call to action' })
    }, 1000)
  ).current

  useEffect(() => {
    return () => {
      debounceUpdateWidget.cancel()
    }
  }, [debounceUpdateWidget])

  return (
    <Box>
      <Title>Call To Action</Title>

      <VStack spacing="4" alignItems="flex-start" w="lg" maxW="full">
        <Text>Display a call to action message next to widget after {widget.call_to_action?.delay ?? 0} seconds.</Text>
        <Slider
          defaultValue={0}
          value={widget.call_to_action?.delay}
          min={0}
          max={60}
          colorScheme="purple"
          onChange={(val) => handleSliderChange(val)}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <Tooltip
            hasArrow
            bg={brandColorToggle}
            color={textColorToggle}
            placement="top"
            isOpen={showTooltip}
            label={`${widget.call_to_action?.delay ?? 0} sec`}
          >
            <SliderThumb bg={brandColorToggle} />
          </Tooltip>
        </Slider>
        <Input placeholder="Message" value={widget.call_to_action?.text ?? ''} onChange={handleChange} />
      </VStack>
    </Box>
  )
}

export default CallToAction
