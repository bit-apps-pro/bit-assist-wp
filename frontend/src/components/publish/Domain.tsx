import {
  Box,
  Button,
  HStack,
  IconButton,
  Text,
  useToast,
  Tooltip,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
} from '@chakra-ui/react'
import ResponseToast from '@components/global/ResponseToast'
import { widgetAtom } from '@globalStates/atoms'
import { produce } from 'immer'
import { useAtom } from 'jotai'
import { useRef } from 'react'
import { HiOutlineTrash } from 'react-icons/hi'

const Domain = ({ domain, index, updateWidget, isWidgetUpdating }) => {
  const toast = useToast({ isClosable: true })
  const initRef = useRef()
  const [widget, setWidget] = useAtom(widgetAtom)

  const handleRemoveDomain = async (domainIndex: number, onClose: Function) => {
    onClose()

    const response = await updateWidget(
      produce(widget, (draft) => {
        draft.domains.splice(domainIndex, 1)
      })
    )

    setWidget((prev) => {
      prev.domains.splice(domainIndex, 1)
    })
    
    ResponseToast({ toast, response, action: 'delete', messageFor: 'Widget domain' })
  }


  return (
    <HStack justifyContent="space-between" gap="4" py="2" px="4" borderTopWidth={`${index > 0 && '1px'}`}>
      <Text>{domain}</Text>
      <Popover closeOnBlur={false} initialFocusRef={initRef}>
        {({ isOpen, onClose }) => (
          <>
            <PopoverTrigger>
              <Box>
                <Tooltip label="Remove domain" placement="right">
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
                <Text>Are you sure you want to remove this domain?</Text>
                <Button mt="4" colorScheme="red" ref={initRef} onClick={() => handleRemoveDomain(index, onClose)} disabled={isWidgetUpdating}>
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

export default Domain
