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
import config from '@config/config'
import { widgetAtom } from '@globalStates/atoms'
import { type Widget } from '@globalStates/Interfaces'
import useToaster from '@hooks/useToaster'
import { produce } from 'immer'
import { useAtom } from 'jotai'
import { useRef } from 'react'
import { HiOutlineTrash } from 'react-icons/hi'

interface Props {
  domain: string
  index: number
  isWidgetUpdating: boolean
  updateWidget: (widget: Widget) => Promise<{ data: string; status: 'error' | 'success' }>
}

function Domain({ domain, index, isWidgetUpdating, updateWidget }: Props) {
  const [widget, setWidget] = useAtom(widgetAtom)
  const initRef = useRef()
  const toaster = useToaster()
  const tabIndex = config.IS_PRO ? 0 : -1

  const handleRemoveDomain = async (domainIndex: number, onClose: () => void) => {
    onClose()

    const { data, status } = await updateWidget(
      produce(widget, draft => {
        draft.domains.splice(domainIndex, 1)
      })
    )

    setWidget(prev => {
      prev.domains.splice(domainIndex, 1)
    })

    toaster(status, data)
  }

  return (
    <HStack
      borderTopWidth={`${index > 0 && '1px'}`}
      gap="4"
      justifyContent="space-between"
      px="4"
      py="2"
    >
      <Text>{domain}</Text>
      <Popover closeOnBlur={false} initialFocusRef={initRef.current}>
        {({ onClose }) => (
          <>
            <PopoverTrigger>
              <Box>
                <Tooltip label="Remove domain" placement="right">
                  <IconButton
                    aria-label="Remove Domain"
                    colorScheme="red"
                    disabled={isWidgetUpdating}
                    icon={<HiOutlineTrash />}
                    isRound
                    tabIndex={tabIndex}
                    variant="ghost"
                  />
                </Tooltip>
              </Box>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverBody>
                <Text>Are you sure you want to remove this domain?</Text>
                <Button
                  colorScheme="red"
                  disabled={isWidgetUpdating}
                  mt="4"
                  onClick={() => handleRemoveDomain(index, onClose)}
                  ref={initRef.current}
                >
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
