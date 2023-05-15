import { Box, HStack, Image, useStyleConfig } from '@chakra-ui/react'
import Title from '@components/global/Title'
import config from '@config/config'
import { widgetAtom } from '@globalStates/atoms'
import useUpdateWidget from '@hooks/mutations/widget/useUpdateWidget'
import useToaster from '@hooks/useToaster'
import { useAtom } from 'jotai'
import { produce } from 'immer'
import { debounce } from 'lodash'
import { useState, useRef, useEffect } from 'react'

export const WidgetStyle = () => {
  const iconOptions = {
    'widget-style-1': `${config.ROOT_URL}/img/widget-style/bit-assist-widget-1.png`,
    'widget-style-2': `${config.ROOT_URL}/img/widget-style/bit-assist-widget-2.png`,
  }

  const [widget, setWidget] = useAtom(widgetAtom)
  const { updateWidget } = useUpdateWidget()
  const toaster = useToaster()

  const styles = {
    position: 'relative',
    transition: 'transform .2s ease-out',
    willChange: 'transform',
    '&:hover': {
      transform: 'scale(1.05)',
      border: '2px solid purple',
      borderRadius: '12px',
    },
    transformOrigin: 'center',
    backfaceVisibility: 'hidden',
    borderRadius: '12px',
  }

  const handleClickChanges = (value: string | number, key: string) => {
    const val = value

    setWidget((prev) => {
      if (prev.styles === null) {
        prev.styles = {}
      }
      prev.styles = { ...prev.styles, [key]: value }
    })

    debounceUpdateWidget(
      produce(widget, (draft) => {
        if (draft.styles === null) {
          draft.styles = {}
        }
        draft.styles.widget_style = val
      }),
    )
  }

  const debounceUpdateWidget = useRef(
    debounce(async (newWidget) => {
      const { status, data } = await updateWidget(newWidget)
      toaster(status, data)
    }, 1000),
  ).current

  useEffect(
    () => () => {
      debounceUpdateWidget.cancel()
    },
    [debounceUpdateWidget],
  )

  return (
    <Box>
      <Title>WidgetStyle</Title>
      <HStack flexWrap="wrap" gap={4} spacing={0} maxH={400}>
        <Box
          sx={styles}
          onClick={() => handleClickChanges('widget_transparent', 'widget_style')}
          border={
            widget?.styles?.widget_style
              ? widget?.styles?.widget_style === 'widget_transparent'
                ? '2px solid purple'
                : 'none'
              : '2px solid purple'
          }
          maxWidth={200}
          cursor="pointer"
        >
          <Image
            src={iconOptions['widget-style-1']}
            alt="widget icon"
            className="widget-icon"
            w="40"
            h="40"
            objectFit="contain"
          />
        </Box>
        <Box
          sx={styles}
          onClick={() => handleClickChanges('widget_box', 'widget_style')}
          border={widget?.styles?.widget_style === 'widget_box' ? '2px solid purple' : 'none'}
          maxWidth={200}
          cursor="pointer"
        >
          <Image
            src={iconOptions['widget-style-2']}
            alt="widget icon"
            className="widget-icon"
            w="40"
            h="40"
            objectFit="contain"
          />
        </Box>
      </HStack>
    </Box>
  )
}
