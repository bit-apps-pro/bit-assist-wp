import { Box, Input, InputGroup, InputRightAddon } from '@chakra-ui/react'
import Title from '@components/global/Title'
import { widgetAtom } from '@globalStates/atoms'
import { __ } from '@helpers/i18nwrap'
import useUpdateWidget from '@hooks/mutations/widget/useUpdateWidget'
import useToaster from '@hooks/useToaster'
import { produce } from 'immer'
import { useAtom } from 'jotai'
import { debounce } from 'lodash'
import { useEffect, useRef } from 'react'

function WidgetSize() {
  const [widget, setWidget] = useAtom(widgetAtom)
  const { updateWidget } = useUpdateWidget()
  const toaster = useToaster()

  const debounceUpdateWidget = useRef(
    debounce(async newWidget => {
      const { data, status } = await updateWidget(newWidget)
      toaster(status, data)
    }, 1000)
  ).current

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value ? Number(e.target.value) : 0
    if (Number.isNaN(val) || val < 0 || val > 200) {
      toaster('warning', __('Widget size must be between 0 and 200'))
      return
    }

    setWidget(prev => {
      if (prev.styles === null || prev.styles === undefined) {
        prev.styles = {}
      }
      prev.styles.size = val
    })
    debounceUpdateWidget(
      produce(widget, draft => {
        if (draft.styles === null || draft.styles === undefined) {
          draft.styles = {}
        }
        draft.styles.size = val
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
    <Box>
      <Title>{__('Widget Size')}</Title>
      <InputGroup>
        <Input
          min="0"
          onChange={handleChange}
          placeholder="60"
          value={widget.styles?.size ?? ''}
          w="28"
        />
        <InputRightAddon>{__('px')}</InputRightAddon>
      </InputGroup>
    </Box>
  )
}

export default WidgetSize
