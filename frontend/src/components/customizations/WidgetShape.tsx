import { Box, HStack, useColorModeValue, useRadioGroup } from '@chakra-ui/react'
import RadioCard from '@components/global/RadioCard'
import Title from '@components/global/Title'
import config from '@config/config'
import { widgetAtom } from '@globalStates/atoms'
import useUpdateWidget from '@hooks/mutations/widget/useUpdateWidget'
import useToaster from '@hooks/useToaster'
import { __ } from '@wordpress/i18n'
import { produce } from 'immer'
import { useAtom } from 'jotai'
import { useEffect } from 'react'

const maskStyle = {
  mask: `url(${config.ROOT_URL}/img/widget-button-mask.svg)`,
  WebkitMask: `url(${config.ROOT_URL}/img/widget-button-mask.svg)`
}

function WidgetShape() {
  const [widget, setWidget] = useAtom(widgetAtom)
  const { updateWidget } = useUpdateWidget()
  const toaster = useToaster()
  const formBackground = useColorModeValue('purple.500', 'purple.200')

  const handleChange = async (shape: string) => {
    setWidget(prev => {
      if (prev.styles === null || prev.styles === undefined) {
        prev.styles = {}
      }
      prev.styles.shape = shape
    })

    const { data, status } = await updateWidget(
      produce(widget, draft => {
        if (draft.styles === null || draft.styles === undefined) {
          draft.styles = {}
        }
        draft.styles.shape = shape
      })
    )
    toaster(status, data)
  }

  const shapeOptions = ['semiRounded', 'rounded', 'circle', 'square']
  const { getRadioProps, getRootProps, setValue } = useRadioGroup({
    defaultValue: widget.styles?.shape,
    name: 'widgetShape',
    onChange: handleChange
  })

  const group = getRootProps()

  useEffect(() => {
    setValue(widget.styles?.shape || '')
  }, [widget.styles?.shape])

  return (
    <Box>
      <Title>{__('Widget Shape', 'bit-assist')}</Title>
      <HStack {...group} flexWrap="wrap" gap={2} spacing={0}>
        {shapeOptions.map(value => {
          const radio = getRadioProps({ value })
          return (
            <RadioCard design="border" key={value} {...radio}>
              {value === shapeOptions[0] && (
                <Box
                  bg={formBackground}
                  className="semiRoundedShape"
                  h="44px"
                  style={maskStyle}
                  w="44px"
                />
              )}
              {value === shapeOptions[1] && <Box bg={formBackground} h="44px" rounded="10px" w="44px" />}
              {value === shapeOptions[2] && <Box bg={formBackground} h="44px" rounded="full" w="44px" />}
              {value === shapeOptions[3] && <Box bg={formBackground} h="44px" rounded="none" w="44px" />}
            </RadioCard>
          )
        })}
      </HStack>
    </Box>
  )
}

export default WidgetShape
