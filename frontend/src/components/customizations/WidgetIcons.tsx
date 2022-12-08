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
import CustomWidgetIcon from '@components/customizations/CustomWidgetIcon'

function WidgetIcons() {
  const [widget, setWidget] = useAtom(widgetAtom)
  const { updateWidget } = useUpdateWidget()
  const toaster = useToaster()

  const iconOptions = {
    'widget-icon-1': `${config.ROOT_URL}/img/widget/widgetIcon1.svg`,
    'widget-icon-2': `${config.ROOT_URL}/img/widget/widgetIcon2.svg`,
    'widget-icon-3': `${config.ROOT_URL}/img/widget/widgetIcon3.svg`,
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
      <CustomWidgetIcon />
    </Box>
  )
}

export default WidgetIcons
