/* eslint-disable react/no-children-prop */
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
  Tooltip,
  useToast,
} from '@chakra-ui/react'
import ResponseToast from '@components/global/ResponseToast'
import { widgetAtom } from '@globalStates/atoms'
import { useAtom } from 'jotai'
import React, { useRef } from 'react'
import { HiOutlineTrash } from 'react-icons/hi'

const Page = ({ pageDomain, page, index, updateWidget, isWidgetUpdating }) => {
  const toast = useToast({ isClosable: true })
  const [widget, setWidget] = useAtom(widgetAtom)

  const handleRemoveDomain = async (domainIndex: number, onClose: Function) => {
    onClose()

    const newPages = [...widget.exclude_pages]
    newPages.splice(domainIndex, 1)
    const response = await updateWidget({ ...widget, exclude_pages: [...newPages] })
    ResponseToast({ toast, response, action: 'delete', messageFor: 'Widget page' })

    setWidget((prev) => {
      prev.exclude_pages.splice(domainIndex, 1)
    })
  }

  const showPageVisibility = (condition: string) => {
    switch (condition) {
      case 'showOn':
        return 'Show On'
      case 'hideOn':
        return 'Hide On'
      default:
        return 'None'
    }
  }

  const showPageCondition = (condition: string) => {
    switch (condition) {
      case 'contains':
        return 'Pages that contain'
      case 'equal':
        return 'Specific page'
      case 'startWith':
        return 'Pages stars with'
      case 'endWith':
        return 'Pages ended with'
      default:
        return 'None'
    }
  }

  const makeUrl = (url: string, condition: string) => {
    switch (condition) {
      case 'contains':
        return `/*${url}*`
      case 'equal':
        return `/${url}`
      case 'startWith':
        return `/${url}*`
      case 'endWith':
        return `/*${url}`
      default:
        return 'None'
    }
  }

  const initRef = useRef()

  return (
    <HStack flexWrap="wrap" justifyContent={'space-between'} spacing="0" gap="2" py="2" px="4" borderTopWidth={`${index > 0 && '1px'}`}>
      <Text>{showPageVisibility(page?.visibility)}</Text>
      <Text>{showPageCondition(page?.condition)}</Text>
      <Text>{makeUrl(page?.url, page?.condition)}</Text>

      <Popover closeOnBlur={false} initialFocusRef={initRef}>
        {({ isOpen, onClose }) => (
          <>
            <PopoverTrigger>
              <Box>
                <Tooltip label="Remove page" placement="right">
                  <IconButton
                    isRound={true}
                    aria-label="Remove Domain"
                    variant="ghost"
                    colorScheme="red"
                    icon={<HiOutlineTrash />}
                    disabled={isWidgetUpdating}
                  />
                </Tooltip>
              </Box>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverBody>
                <Text>Are you sure you want to remove this page?</Text>
                <Button mt={4} colorScheme={'red'} ref={initRef} onClick={() => handleRemoveDomain(index, onClose)} disabled={isWidgetUpdating}>
                  Confirm
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
