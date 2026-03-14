import { Box, Switch } from '@chakra-ui/react'
import ProWrapper from '@components/global/ProWrapper'
import Title from '@components/global/Title'
import { widgetAtom } from '@globalStates/atoms'
import useUpdateWidget from '@hooks/mutations/widget/useUpdateWidget'
import useToaster from '@hooks/useToaster'
import { __ } from '@wordpress/i18n'
import { produce } from 'immer'
import { useAtom } from 'jotai'
import { debounce } from 'lodash'
import { useEffect, useRef, useState } from 'react'

function GoogleAnalytics() {
  const [isEnabled, setIsEnabled] = useState(false)
  const toaster = useToaster()
  const [widget, setWidget] = useAtom(widgetAtom)
  const { updateWidget } = useUpdateWidget()

  useEffect(() => {
    setIsEnabled(widget.styles?.google_analytics === 1)
  }, [widget.styles?.google_analytics])

  const debounceUpdateWidget = useRef(
    debounce(async newWidget => {
      const { data, status } = await updateWidget(newWidget)
      toaster(status, data)
    }, 1000)
  ).current

  const handleSwitchEnable = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsEnabled(e.target.checked)
    const googleAnalytics = e.target.checked ? 1 : 0

    setWidget(prev => {
      if (prev.styles == undefined) {
        prev.styles = {}
      }
      prev.styles.google_analytics = googleAnalytics
    })

    debounceUpdateWidget(
      produce(widget, draft => {
        if (draft.styles === undefined) {
          draft.styles = {}
        }
        draft.styles.google_analytics = googleAnalytics
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
    <ProWrapper>
      <Box maxW="full" mb={'-7'} w="lg">
        <Title>
          {__('Google Analytics', 'bit-assist')}
          <Switch colorScheme="purple" isChecked={!!isEnabled} ml={4} onChange={handleSwitchEnable} />
        </Title>
      </Box>
    </ProWrapper>
  )
}
export default GoogleAnalytics
