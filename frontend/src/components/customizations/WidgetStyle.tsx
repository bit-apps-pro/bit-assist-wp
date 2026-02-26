import { Box, HStack, Image } from '@chakra-ui/react'
import Title from '@components/global/Title'
import config from '@config/config'
import { widgetAtom } from '@globalStates/atoms'
import useUpdateWidget from '@hooks/mutations/widget/useUpdateWidget'
import useToaster from '@hooks/useToaster'
import { __ } from '@wordpress/i18n'
import { produce } from 'immer'
import { useAtom } from 'jotai'
import { debounce } from 'lodash'
import { useEffect, useRef } from 'react'

export const WidgetStyle = () => {
  const iconOptions = {
    'widget-style-1': `${config.ROOT_URL}/img/widget-style/bit-assist-widget-1.png`,
    'widget-style-2': `${config.ROOT_URL}/img/widget-style/bit-assist-widget-2.png`
  }

  const [widget, setWidget] = useAtom(widgetAtom)
  const { updateWidget } = useUpdateWidget()
  const toaster = useToaster()

  const debounceUpdateWidget = useRef(
    debounce(async newWidget => {
      const { data, status } = await updateWidget(newWidget)
      toaster(status, data)
    }, 1000)
  ).current

  const handleClickChanges = (value: number | string, key: string) => {
    const val = value

    setWidget(prev => {
      if (prev.styles === null || prev.styles === undefined) {
        prev.styles = {}
      }
      prev.styles = { ...prev.styles, [key]: value }
    })

    debounceUpdateWidget(
      produce(widget, draft => {
        if (draft.styles === null || draft.styles === undefined) {
          draft.styles = {}
        }
        draft.styles.widget_style = val
      })
    )
  }

  useEffect(
    () => () => {
      debounceUpdateWidget.cancel()
    },
    [debounceUpdateWidget]
  )

  return (
    <Box>
      <Title>{__('Widget Style', 'bit-assist')}</Title>
      <HStack flexWrap="wrap" gap={4} maxH={400} spacing={0}>
        <Image
          _hover={{
            borderColor: 'purple',
            boxShadow: 'lg',
            transform: 'translateY(-5px)'
          }}
          alt={__('Widget style', 'bit-assist')}
          border={
            widget?.styles?.widget_style
              ? widget?.styles?.widget_style === 'widget_transparent'
                ? '2px solid purple'
                : '2px solid transparent'
              : '2px solid purple'
          }
          borderRadius={12}
          cursor="pointer"
          h="40"
          objectFit="contain"
          onClick={() => handleClickChanges('widget_transparent', 'widget_style')}
          src={iconOptions['widget-style-1']}
          transition="transform 0.3s ease, box-shadow 0.3s ease"
          w="40"
        />
        <Image
          _hover={{
            borderColor: 'purple',
            boxShadow: 'lg',
            transform: 'translateY(-5px)'
          }}
          alt={__('Widget style', 'bit-assist')}
          border={
            widget?.styles?.widget_style === 'widget_box' ? '2px solid purple' : '2px solid transparent'
          }
          borderRadius={12}
          cursor="pointer"
          h="40"
          objectFit="contain"
          onClick={() => handleClickChanges('widget_box', 'widget_style')}
          src={iconOptions['widget-style-2']}
          transition="transform 0.3s ease, box-shadow 0.3s ease"
          w="40"
        />
      </HStack>
    </Box>
  )
}
