import { Box, Switch } from '@chakra-ui/react'
import useToaster from '@hooks/useToaster'
import Title from '@components/global/Title'
import { widgetAtom } from '@globalStates/atoms'
import useUpdateWidget from '@hooks/mutations/widget/useUpdateWidget'
import { produce } from 'immer'
import { useAtom } from 'jotai'
import { debounce } from 'lodash'
import { useEffect, useRef, useState } from 'react'
import ProWrapper from '@components/global/ProWrapper'

function GoogleAnalytics() {
  const [isEnabled, setIsEnabled] = useState(false)
  const toaster = useToaster()
  const [widget, setWidget] = useAtom(widgetAtom)
  const { updateWidget } = useUpdateWidget()

  useEffect(() => {
    widget.styles?.google_analytics === 1 ? setIsEnabled(true) : setIsEnabled(false)
  }, [widget.styles?.google_analytics])

  const handleSwitchEnable = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsEnabled(e.target.checked)
    const googleAnalytics = e.target.checked ? 1 : 0

    setWidget((prev) => {
      prev.styles != null ? (prev.styles.google_analytics = googleAnalytics) : (prev.styles = {})
    })

    debounceUpdateWidget(
      produce(widget, (draft) => {
        draft.styles !== null ? (draft.styles.google_analytics = googleAnalytics) : (draft.styles = {})
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
    <ProWrapper>
      <Box w="lg" maxW="full" mb={'-7'}>
        <Title>
          Google Analytics
          <Switch ml={4} isChecked={!!isEnabled} colorScheme="purple" onChange={handleSwitchEnable} />
        </Title>
      </Box>
    </ProWrapper>
  )
}
export default GoogleAnalytics
