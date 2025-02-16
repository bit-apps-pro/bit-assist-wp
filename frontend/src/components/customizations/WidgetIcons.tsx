import { Box, HStack, Image, useRadioGroup } from '@chakra-ui/react'
import CustomWidgetIcon from '@components/customizations/CustomWidgetIcon'
import RadioCard from '@components/global/RadioCard'
import Title from '@components/global/Title'
import config from '@config/config'
import { widgetAtom } from '@globalStates/atoms'
import useUpdateWidget from '@hooks/mutations/widget/useUpdateWidget'
import useToaster from '@hooks/useToaster'
import { produce } from 'immer'
import { useAtom } from 'jotai'
import { useEffect } from 'react'

function WidgetIcons() {
  const [widget, setWidget] = useAtom(widgetAtom)
  const { updateWidget } = useUpdateWidget()
  const toaster = useToaster()

  const iconOptions = {
    'widget-icon-1': `${config.ROOT_URL}/img/widget/widgetIcon1.svg`,
    'widget-icon-2': `${config.ROOT_URL}/img/widget/widgetIcon2.svg`,
    'widget-icon-3': `${config.ROOT_URL}/img/widget/widgetIcon3.svg`
  }

  const handleChange = async (icon: 'widget-icon-1' | 'widget-icon-2' | 'widget-icon-3') => {
    setWidget(prev => {
      if (prev.styles === null || prev.styles === undefined) {
        prev.styles = {}
      }
      prev.styles.icon = icon
      prev.styles.iconUrl = iconOptions[icon]
    })

    const { data, status } = await updateWidget(
      produce(widget, draft => {
        if (draft.styles === null || draft.styles === undefined) {
          draft.styles = {}
        }
        draft.styles.icon = icon
        draft.styles.iconUrl = iconOptions[icon]
      })
    )
    toaster(status, data)
  }

  const { getRadioProps, getRootProps, setValue } = useRadioGroup({
    defaultValue: widget.styles?.icon,
    name: 'widgetIcon',
    onChange: handleChange
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
              <Image
                alt="widget icon"
                className="widget-icon"
                h="7"
                objectFit="contain"
                src={url}
                w="7"
              />
            </RadioCard>
          )
        })}
      </HStack>
      <CustomWidgetIcon />
    </Box>
  )
}

export default WidgetIcons
