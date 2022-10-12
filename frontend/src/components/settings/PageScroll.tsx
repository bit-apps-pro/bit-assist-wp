/* eslint-disable react/no-children-prop */
import { HStack, Input, InputGroup, InputRightAddon, Text } from '@chakra-ui/react'
import useToaster from '@hooks/useToaster'
import { widgetAtom } from '@globalStates/atoms'
import useUpdateWidget from '@hooks/mutations/widget/useUpdateWidget'
import { produce } from 'immer'
import { useAtom } from 'jotai'
import { debounce } from 'lodash'
import { useEffect, useRef } from 'react'

function PageScroll() {
  const toaster = useToaster()
  const [widget, setWidget] = useAtom(widgetAtom)
  const { updateWidget } = useUpdateWidget()

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value ? parseInt(e.target.value, 2) : 0
    if (val > 100) {
      val = 100
    }
    setWidget((draft) => {
      draft.page_scroll = val
    })
    debounceUpdateWidget(
      produce(widget, (draft) => {
        draft.page_scroll = val
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
    <HStack>
      <Text w="28">Page scroll</Text>
      <InputGroup>
        <Input w="28" min="0" type="number" placeholder="Page Scroll in %" value={widget.page_scroll ?? ''} onChange={handleChange} />
        <InputRightAddon children="%" />
      </InputGroup>
    </HStack>
  )
}

export default PageScroll
