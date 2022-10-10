import { Box, HStack, Image, useRadioGroup, useToast } from '@chakra-ui/react'
import RadioCard from '@components/global/RadioCard'
import Title from '@components/global/Title'
import { useAtom } from 'jotai'
import useUpdateWidget from '@hooks/mutations/widget/useUpdateWidget'
import { widgetAtom } from '@globalStates/atoms'
import ResponseToast from '@components/global/ResponseToast'
import { produce } from 'immer'
import { useEffect } from 'react'

function WidgetIcons() {
  const toast = useToast({ isClosable: true })
  const [widget, setWidget] = useAtom(widgetAtom)
  const { updateWidget } = useUpdateWidget()

  const handleChange = async (icon: string) => {
    setWidget((prev) => {
      if (prev.styles === null) {
        prev.styles = {}
      }
      prev.styles.icon = icon
      prev.styles.iconUrl = iconOptions[icon]
    })

    const response: any = await updateWidget(
      produce(widget, (draft) => {
        if (draft.styles === null) {
          draft.styles = {}
        }
        draft.styles.icon = icon
        draft.styles.iconUrl = iconOptions[icon]
      }),
    )
    ResponseToast({ toast, response, action: 'update', messageFor: 'Widget icon' })
  }

  const iconOptions = {
    'widget-icon-1': 'https://ik.imagekit.io/shuvo/widget_icons/eye_j4gQF6dk-.png?ik-sdk-version=javascript-1.4.3&updatedAt=1656306394910',
    'widget-icon-2': 'https://ik.imagekit.io/shuvo/widget_icons/comment_pkWd0-hi6.png?ik-sdk-version=javascript-1.4.3&updatedAt=1656306468414',
    'widget-icon-3': 'https://ik.imagekit.io/shuvo/widget_icons/chat_kiw1xpsa4.png?ik-sdk-version=javascript-1.4.3&updatedAt=1656306468674',
  }

  const { getRootProps, getRadioProps, setValue } = useRadioGroup({
    name: 'widgetIcon',
    defaultValue: widget.styles?.icon,
    onChange: handleChange,
  })

  const group = getRootProps()

  useEffect(() => {
    setValue(widget.styles?.icon)
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
