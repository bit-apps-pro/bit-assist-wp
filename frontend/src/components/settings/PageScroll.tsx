/* eslint-disable react/no-children-prop */
import { HStack, Input, InputGroup, InputRightAddon, Text } from '@chakra-ui/react'
import { widgetAtom } from '@globalStates/atoms'
import useUpdateWidget from '@hooks/mutations/widget/useUpdateWidget'
import useToaster from '@hooks/useToaster'
import { __ } from '@wordpress/i18n'
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
      toaster('warning', __('Page scroll must be between 0 and 100', 'bit-assist'))
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
      <Text w="28">{__('Page scroll', 'bit-assist')}</Text>
      <InputGroup>
        <Input
          min="0"
          onChange={handleChange}
          placeholder={__('Page Scroll in %', 'bit-assist')}
          value={widget.page_scroll ?? ''}
          w="28"
        />
        <InputRightAddon children="%" />
      </InputGroup>
    </HStack>
  )
}

export default PageScroll
