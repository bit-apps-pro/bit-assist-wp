import { str2Color } from '@atomik-color/core'
import { type TColor } from '@atomik-color/core/dist/types'
import { Box, Switch, Text } from '@chakra-ui/react'
import ColorPickerWrap from '@components/global/ColorPickerWrap'
import Title from '@components/global/Title'
import { widgetAtom } from '@globalStates/atoms'
import useUpdateWidget from '@hooks/mutations/widget/useUpdateWidget'
import useToaster from '@hooks/useToaster'
import { produce } from 'immer'
import { useAtom } from 'jotai'
import { debounce } from 'lodash'
import { useEffect, useRef, useState } from 'react'

function WidgetActiveBadge() {
  const [isEnabled, setIsEnabled] = useState(false)
  const [widget, setWidget] = useAtom(widgetAtom)
  const { updateWidget } = useUpdateWidget()
  const colorChangedRef = useRef<boolean>(false)
  const toaster = useToaster()

  useEffect(() => {
    if (widget.styles?.badge_active === 1) {
      setIsEnabled(true)
    } else {
      setIsEnabled(false)
    }
  }, [widget.styles?.badge_active])

  const debounceUpdateWidget = useRef(
    debounce(async newWidget => {
      const { data, status } = await updateWidget(newWidget)
      toaster(status, data)
    }, 1000)
  ).current

  const handleSwitchEnable = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsEnabled(e.target.checked)
    const defaultColor = widget.styles?.badge_color || str2Color('#05f609')
    const defaultActiveStatus = 0
    const badgeActive = e.target.checked ? 1 : defaultActiveStatus
    const badgeColor = e.target.checked ? widget.styles?.badge_color : defaultColor

    setWidget(prev => {
      if (prev.styles === null || prev.styles === undefined) {
        prev.styles = {}
      }
      prev.styles.badge_active = badgeActive
      prev.styles.badge_color = badgeColor
    })

    debounceUpdateWidget(
      produce(widget, draft => {
        if (draft.styles === null || draft.styles === undefined) {
          draft.styles = {}
        }
        draft.styles.badge_active = badgeActive
        draft.styles.badge_color = badgeColor
      })
    )
  }

  useEffect(
    () => () => {
      debounceUpdateWidget.cancel()
    },
    [debounceUpdateWidget]
  )

  const handleClose = async () => {
    if (!colorChangedRef.current) return
    colorChangedRef.current = false
    const { data, status } = await updateWidget(widget)
    toaster(status, data)
  }

  const handleColorChange = (color: TColor) => {
    colorChangedRef.current = true
    setWidget(prev => {
      if (prev.styles === null || prev.styles === undefined) {
        prev.styles = {}
      }
      prev.styles.badge_color = color
    })
  }

  return (
    <Box>
      <Box alignItems="center" display="flex" mb={-10}>
        <Title>
          Enable Widget Active Badge
          <Switch colorScheme="purple" isChecked={!!isEnabled} ml={4} onChange={handleSwitchEnable} />
        </Title>
      </Box>

      {isEnabled && (
        <Box mt={2}>
          <Text mb={1}>Choose Badge Color</Text>
          <ColorPickerWrap
            color={widget.styles?.badge_color || str2Color('#05f609')}
            handleChange={handleColorChange}
            handleClose={handleClose}
          />
        </Box>
      )}
    </Box>
  )
}

export default WidgetActiveBadge
