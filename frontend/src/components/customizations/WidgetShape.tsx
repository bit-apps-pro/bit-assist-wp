import { Box, HStack, useRadioGroup, useToast, useColorModeValue } from '@chakra-ui/react'
import useUpdateWidget from '@hooks/mutations/widget/useUpdateWidget'
import ResponseToast from '@components/global/ResponseToast'
import RadioCard from '@components/global/RadioCard'
import { widgetAtom } from '@globalStates/atoms'
import Title from '@components/global/Title'
import { useEffect } from 'react'
import { useAtom } from 'jotai'
import { produce } from 'immer'

const WidgetShape = () => {
  const toast = useToast({ isClosable: true })
  const [widget, setWidget] = useAtom(widgetAtom)
  const { updateWidget } = useUpdateWidget()
  const formBackground = useColorModeValue('purple.500', 'purple.200')

  const handleChange = async (shape: string) => {
    setWidget((prev) => {
      if (prev.styles === null) {
        prev.styles = {}
      }
      prev.styles.shape = shape
    })

    const response: any = await updateWidget(
      produce(widget, (draft) => {
        if (draft.styles === null) {
          draft.styles = {}
        }
        draft.styles.shape = shape
      })
    )
    ResponseToast({ toast, response, action: 'update', messageFor: 'Widget shape' })
  }

  const shapeOptions = ['semiRounded', 'rounded', 'circle', 'square']
  const { getRootProps, getRadioProps, setValue } = useRadioGroup({
    name: 'widgetShape',
    defaultValue: widget.styles?.shape,
    onChange: handleChange,
  })

  const group = getRootProps()

  useEffect(() => {
    setValue(widget.styles?.shape)
  }, [widget.styles?.shape])

  return (
    <Box>
      <Title>Widget Shape</Title>
      <HStack {...group} flexWrap="wrap" gap={2} spacing={0}>
        {shapeOptions.map((value) => {
          const radio = getRadioProps({ value })
          return (
            <RadioCard design="border" key={value} {...radio}>
              {value === shapeOptions[0] && <Box h="44px" w="44px" bg={formBackground} className="semiRoundedShape" />}
              {value === shapeOptions[1] && <Box h="44px" w="44px" bg={formBackground} rounded="10px" />}
              {value === shapeOptions[2] && <Box h="44px" w="44px" bg={formBackground} rounded="full" />}
              {value === shapeOptions[3] && <Box h="44px" w="44px" bg={formBackground} rounded="none" />}
            </RadioCard>
          )
        })}
      </HStack>
    </Box>
  )
}

export default WidgetShape
