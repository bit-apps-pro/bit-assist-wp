import { Box,
  Button,
  HStack,
  IconButton,
  Text,
  Tooltip,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody } from '@chakra-ui/react'
import useToaster from '@hooks/useToaster'
import { widgetAtom } from '@globalStates/atoms'
import { produce } from 'immer'
import { useAtom } from 'jotai'
import { useRef } from 'react'
import { HiOutlineTrash } from 'react-icons/hi'
import { Widget } from '@globalStates/Interfaces'
import config from '@config/config'

interface Props {
  domain: string
  index: number
  updateWidget: (widget: Widget) => Promise<{ status: 'success' | 'error', data: string }>
  isWidgetUpdating: boolean
}

function Domain({ domain, index, updateWidget, isWidgetUpdating }: Props) {
  const [widget, setWidget] = useAtom(widgetAtom)
  const initRef = useRef()
  const toaster = useToaster()
  const tabIndex = config.IS_PRO ? 0 : -1

  const handleRemoveDomain = async (domainIndex: number, onClose: () => void) => {
    onClose()

    const { status, data } = await updateWidget(
      produce(widget, (draft) => {
        draft.domains.splice(domainIndex, 1)
      }),
    )

    setWidget((prev) => {
      prev.domains.splice(domainIndex, 1)
    })

    toaster(status, data)
  }

  return (
    <HStack justifyContent="space-between" gap="4" py="2" px="4" borderTopWidth={`${index > 0 && '1px'}`}>
      <Text>{domain}</Text>
      <Popover closeOnBlur={false} initialFocusRef={initRef.current}>
        {({ isOpen, onClose }) => (
          <>
            <PopoverTrigger>
              <Box>
                <Tooltip label="Remove domain" placement="right">
                  <IconButton
                    isRound
                    aria-label="Remove Domain"
                    variant="ghost"
                    colorScheme="red"
                    icon={<HiOutlineTrash />}
                    disabled={isWidgetUpdating}
                    tabIndex={tabIndex}
                  />
                </Tooltip>
              </Box>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverBody>
                <Text>Are you sure you want to remove this domain?</Text>
                <Button mt="4" colorScheme="red" ref={initRef.current} onClick={() => handleRemoveDomain(index, onClose)} disabled={isWidgetUpdating}>
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
