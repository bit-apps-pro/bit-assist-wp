import {
  Box,
  Button,
  HStack,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Text,
  Tooltip
} from '@chakra-ui/react'
import { widgetAtom } from '@globalStates/atoms'
import { type ExcludePages, type Widget } from '@globalStates/Interfaces'
import { __ } from '@helpers/i18nwrap'
import useToaster from '@hooks/useToaster'
import { useAtom } from 'jotai'
import { useRef } from 'react'
import { HiOutlineTrash } from 'react-icons/hi'

interface Props {
  index: number
  isWidgetUpdating: boolean
  page: ExcludePages
  pageDomain: string
  updateWidget: (widget: Widget) => Promise<{ data: string; status: 'error' | 'success' }>
}

const showPageVisibility = (condition: string) => {
  switch (condition) {
    case 'hideOn': {
      return __('Hide On')
    }
    case 'showOn': {
      return __('Show On')
    }
    default: {
      return __('None')
    }
  }
}

const showPageCondition = (condition: string) => {
  switch (condition) {
    case 'contains': {
      return __('Pages that contain')
    }
    case 'endWith': {
      return __('Pages ended with')
    }
    case 'equal': {
      return __('Specific page')
    }
    case 'startWith': {
      return __('Pages starts with')
    }
    default: {
      return __('None')
    }
  }
}

const makeUrl = (url: string, condition: string) => {
  switch (condition) {
    case 'contains': {
      return `/*${url}*`
    }
    case 'endWith': {
      return `/*${url}`
    }
    case 'equal': {
      return `/${url}`
    }
    case 'startWith': {
      return `/${url}*`
    }
    default: {
      return __('None')
    }
  }
}

function Page({ index, isWidgetUpdating, page, updateWidget }: Props) {
  const toaster = useToaster()
  const [widget, setWidget] = useAtom(widgetAtom)

  const handleRemoveDomain = async (domainIndex: number, onClose: () => void) => {
    onClose()

    const newPages = [...widget.exclude_pages]
    newPages.splice(domainIndex, 1)
    const { data, status } = await updateWidget({ ...widget, exclude_pages: [...newPages] })
    toaster(status, data)

    setWidget(prev => {
      prev.exclude_pages.splice(domainIndex, 1)
    })
  }

  const initRef = useRef()

  return (
    <HStack
      borderTopWidth={`${index > 0 && '1px'}`}
      flexWrap="wrap"
      gap="2"
      justifyContent="space-between"
      px="4"
      py="2"
      spacing="0"
    >
      <Text>{showPageVisibility(page?.visibility)}</Text>
      <Text>{showPageCondition(page?.condition)}</Text>
      <Text>{makeUrl(page?.url, page?.condition)}</Text>

      <Popover closeOnBlur={false} initialFocusRef={initRef.current}>
        {({ onClose }) => (
          <>
            <PopoverTrigger>
              <Box>
                <Tooltip label={__('Remove page')} placement="right">
                  <IconButton
                    aria-label={__('Remove page')}
                    colorScheme="red"
                    disabled={isWidgetUpdating}
                    icon={<HiOutlineTrash />}
                    isRound
                    variant="ghost"
                  />
                </Tooltip>
              </Box>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverBody>
                <Text>{__('Are you sure you want to remove this page?')}</Text>
                <Button
                  colorScheme="red"
                  disabled={isWidgetUpdating}
                  mt={4}
                  onClick={() => handleRemoveDomain(index, onClose)}
                  ref={initRef.current}
                >
                  {__('Confirm')}
                </Button>
              </PopoverBody>
            </PopoverContent>
          </>
        )}
      </Popover>
    </HStack>
  )
}

export default Page
