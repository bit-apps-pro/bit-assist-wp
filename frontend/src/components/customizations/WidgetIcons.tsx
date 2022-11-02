/* eslint-disable react/jsx-props-no-spreading */
import { Box, HStack, Image, useRadioGroup } from '@chakra-ui/react'
import RadioCard from '@components/global/RadioCard'
import Title from '@components/global/Title'
import { useAtom } from 'jotai'
import useUpdateWidget from '@hooks/mutations/widget/useUpdateWidget'
import { widgetAtom } from '@globalStates/atoms'
import useToaster from '@hooks/useToaster'
import { produce } from 'immer'
import { useEffect } from 'react'
import config from '@config/config'

import widgetIcon1 from '@resource/img/widget/widgetIcon1.svg'
import widgetIcon2 from '@resource/img/widget/widgetIcon2.svg'
import widgetIcon3 from '@resource/img/widget/widgetIcon3.svg'

function WidgetIcons() {
  const [widget, setWidget] = useAtom(widgetAtom)
  const { updateWidget } = useUpdateWidget()
  const toaster = useToaster()

  const getWidgetIcon = (urlIcon: string, importIcon: string) => {
    return import.meta.env.MODE === 'development' ? `${config.ROOT_URL}/frontend/src/resource/img/widget/${urlIcon}` : importIcon
  }

  const iconOptions = {
    'widget-icon-1': getWidgetIcon('widgetIcon1.svg', widgetIcon1),
    'widget-icon-2': getWidgetIcon('widgetIcon2.svg', widgetIcon2),
    'widget-icon-3': getWidgetIcon('widgetIcon3.svg', widgetIcon3),
  }

  const handleChange = async (icon: 'widget-icon-1' | 'widget-icon-2' | 'widget-icon-3') => {
    setWidget((prev) => {
      if (prev.styles === null) {
        prev.styles = {}
      }
      prev.styles.icon = icon
      prev.styles.iconUrl = iconOptions[icon]
    })

    const { status, data } = await updateWidget(
      produce(widget, (draft) => {
        if (draft.styles === null) {
          draft.styles = {}
        }
        draft.styles.icon = icon
        draft.styles.iconUrl = iconOptions[icon]
      }),
    )
    toaster(status, data)
  }

  const { getRootProps, getRadioProps, setValue } = useRadioGroup({
    name: 'widgetIcon',
    defaultValue: widget.styles?.icon,
    onChange: handleChange,
  })

  const group = getRootProps()

  useEffect(() => {
    setValue(widget.styles?.icon || '')
  }, [widget.styles?.icon])

  return (
    <Box>
      <Title>Widget Icon</Title>
      <HStack {...group} flexWrap="wrap" gap={2} spacing={0}>
        {Object.entries(iconOptions).map(([value, url]) => {
          const radio = getRadioProps({ value })
          return (
            <RadioCard key={value} {...radio}>
              <Image src={url} alt="widget icon" className="widget-icon" w="7" h="7" objectFit="contain" />
            </RadioCard>
          )
        })}
      </HStack>
    </Box>
  )
}

export default WidgetIcons
