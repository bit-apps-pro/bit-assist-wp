/* eslint-disable react/no-children-prop */
import { HStack, Input, InputGroup, InputRightAddon, Text } from '@chakra-ui/react'
import { widgetAtom } from '@globalStates/atoms'
import useUpdateWidget from '@hooks/mutations/widget/useUpdateWidget'
import useToaster from '@hooks/useToaster'
import { produce } from 'immer'
import { useAtom } from 'jotai'
import { debounce } from 'lodash'
import { useEffect, useRef } from 'react'

function PageScroll() {
  const toaster = useToaster()
  const [widget, setWidget] = useAtom(widgetAtom)
  const { updateWidget } = useUpdateWidget()

  const debounceUpdateWidget = useRef(
    debounce(async newWidget => {
      const { data, status } = await updateWidget(newWidget)
      toaster(status, data)
    }, 1000)
  ).current

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value ? Number(e.target.value) : 0
    if (Number.isNaN(val) || val < 0 || val > 100) {
      toaster('warning', 'Page scroll must be between 0 and 100')
      return
    }

    setWidget(draft => {
      draft.page_scroll = val
    })
    debounceUpdateWidget(
      produce(widget, draft => {
        draft.page_scroll = val
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
    <HStack mt="2">
      <Text w="28">Page scroll</Text>
      <InputGroup>
        <Input
          min="0"
          onChange={handleChange}
          placeholder="Page Scroll in %"
          value={widget.page_scroll ?? ''}
          w="28"
        />
        <InputRightAddon children="%" />
      </InputGroup>
    </HStack>
  )
}

export default PageScroll
