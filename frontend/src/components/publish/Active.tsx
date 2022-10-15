/* eslint-disable react/no-children-prop */
import { Switch, Text, VStack } from '@chakra-ui/react'
import useToaster from '@hooks/useToaster'
import { widgetAtom } from '@globalStates/atoms'
import useUpdateWidget from '@hooks/mutations/widget/useUpdateWidget'
import { produce } from 'immer'
import { useAtom } from 'jotai'
import { debounce } from 'lodash'
import { useEffect, useRef } from 'react'
import Title from '@components/global/Title'

function Active() {
  const toaster = useToaster()
  const [widget, setWidget] = useAtom(widgetAtom)
  const { updateWidget } = useUpdateWidget()

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setWidget((draft) => {
      draft.active = e.target.checked
    })
    debounceUpdateWidget(
      produce(widget, (draft) => {
        draft.active = e.target.checked
      }),
    )
  }

  const debounceUpdateWidget = useRef(
    debounce(async (newWidget) => {
      const { status, data } = await updateWidget(newWidget)
      toaster(status, data)
    }, 1000),
  ).current

  useEffect(() => () => {
    debounceUpdateWidget.cancel()
  }, [debounceUpdateWidget])

  return (
    <VStack alignItems="flex-start">
      <Title>Active Widget</Title>
      <Text mb="2">
        Add this widget in your website (
        {' '}
        {window.location.origin}
        {' '}
        )
      </Text>
      <Switch isChecked={widget.active} onChange={handleChange} />
    </VStack>
  )
}

export default Active
