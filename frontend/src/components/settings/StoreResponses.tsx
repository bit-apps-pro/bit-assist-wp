import { Box, FormControl, FormLabel, Switch, useToast } from '@chakra-ui/react'
import ResponseToast from '@components/global/ResponseToast'
import { widgetAtom } from '@globalStates/atoms'
import useUpdateWidget from '@hooks/mutations/widget/useUpdateWidget'
import { produce } from 'immer'
import { useAtom } from 'jotai'
import { debounce } from 'lodash'
import { useEffect, useRef } from 'react'

const StoreResponses = () => {
  const toast = useToast({ isClosable: true })
  const [widget, setWidget] = useAtom(widgetAtom)
  const { updateWidget, isWidgetUpdating } = useUpdateWidget()

  const handleSwitchEnable = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setWidget((prev) => {
      prev.store_responses = e.target.checked
    })

    debounceUpdateWidget(
      produce(widget, (draft) => {
        draft.store_responses = e.target.checked
      })
    )
  }

  const debounceUpdateWidget = useRef(
    debounce(async (widget) => {
      const response: any = await updateWidget(widget)
      ResponseToast({ toast, response, action: 'update', messageFor: 'Widget store responses' })
    }, 1000)
  ).current

  useEffect(() => {
    return () => {
      debounceUpdateWidget.cancel()
    }
  }, [debounceUpdateWidget])

  return (
    <Box>
      <FormControl display="flex" alignItems="center">
        <FormLabel htmlFor="storeResponses" mb="0">
          Store Responses
        </FormLabel>
        <Switch isChecked={!!widget.store_responses} colorScheme={'purple'} onChange={handleSwitchEnable} id="storeResponses" />
      </FormControl>
    </Box>
  )
}

export default StoreResponses
