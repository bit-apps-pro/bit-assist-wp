/* eslint-disable react/jsx-props-no-spreading */
import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react'
import { useRef } from 'react'
import { useAtom } from 'jotai'
import { DragHandleIcon } from '@chakra-ui/icons'
import { FiCopy, FiEdit2, FiList, FiTrash2 } from 'react-icons/fi'
import { editWidgetChannelIdAtom } from '@globalStates/atoms'
import EditChannel from '@components/widgetChannels/EditChannel'
import useDeleteWidgetChannel from '@hooks/mutations/widgetChannel/useDeleteWidgetChannel'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { HiDotsVertical } from 'react-icons/hi'
import { Link } from 'react-router-dom'
import { WidgetChannelType } from '@globalStates/Interfaces'
import useCopyWidgetChannel from '@hooks/mutations/widgetChannel/useCopyWidgetChannel'
import useToaster from '@hooks/useToaster'

interface WidgetChannelProps {
  widgetChannel: WidgetChannelType
  shadow?: string
  cursor?: string
  bg?: string
}

function WidgetChannel({ widgetChannel, shadow = 'none', cursor = 'grab', bg = 'none' }: WidgetChannelProps) {
  const tempWidgetChannelId = useRef<number>(0)
  const [, setEditWidgetChannelId] = useAtom(editWidgetChannelIdAtom)
  const brandColorToggle = useColorModeValue('purple.500', 'purple.200')
  const channelColorToggle = useColorModeValue('white', 'gray.800')
  const { deleteWidgetChannel, isWidgetChannelDeleting } = useDeleteWidgetChannel()
  const { copyWidgetChannel, isWidgetChannelCoping } = useCopyWidgetChannel()
  const { isOpen: isOpenEditModal, onOpen: openEditModal, onClose: closeEditModal } = useDisclosure()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toaster = useToaster()

  const onOpenEditModal = (widgetChannelId: number) => () => {
    setEditWidgetChannelId(widgetChannelId)
    openEditModal()
  }

  const onCopyChannel = (widgetChannelId: number) => async () => {
    const { status, data } = await copyWidgetChannel(widgetChannelId)
    toaster(status, data)
  }

  const openDeleteModal = (widgetChannelId: number) => () => {
    tempWidgetChannelId.current = widgetChannelId
    onOpen()
  }

  const handleDeleteWidgetChannel = async () => {
    await deleteWidgetChannel(tempWidgetChannelId.current)
    onClose()
  }

  const { attributes, listeners, setNodeRef, transition, transform, isDragging } = useSortable({
    id: widgetChannel.id,
  })

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.4 : 1,
    touchAction: 'pinch-zoom',
  }

  return (
    <>
      <HStack
        px="3"
        py="2"
        w="full"
        rounded="md"
        style={style}
        ref={setNodeRef}
        borderWidth={1}
        bg={channelColorToggle}
        shadow={shadow}
        justifyContent="space-between"
      >
        <HStack>
          <Flex
            {...listeners}
            {...attributes}
            rounded="sm"
            bg={bg}
            cursor={cursor}
            justifyContent="center"
            alignItems="center"
            w={6}
            h={8}
          >
            <DragHandleIcon aria-label="draggable button" />
          </Flex>
          <Text
            _hover={{ color: brandColorToggle }}
            ml="2"
            cursor="pointer"
            display="inline-block"
            onClick={onOpenEditModal(widgetChannel.id)}
          >
            {widgetChannel.config?.title}
          </Text>
        </HStack>
        <Box>
          <Menu>
            <MenuButton isRound as={IconButton} aria-label="Options" icon={<HiDotsVertical />} />
            <MenuList shadow="lg">
              <MenuItem icon={<FiEdit2 />} onClick={onOpenEditModal(widgetChannel.id)}>
                Edit
              </MenuItem>
              <MenuItem icon={<FiCopy />} onClick={onCopyChannel(widgetChannel.id)}>
                Duplicate
              </MenuItem>
              {widgetChannel.config?.card_config?.form_fields && (
                <Link to={`/responses/${widgetChannel.id}`}>
                  <MenuItem icon={<FiList />}>Responses</MenuItem>
                </Link>
              )}
              <MenuItem icon={<FiTrash2 />} color="red.600" onClick={openDeleteModal(widgetChannel.id)}>
                Delete
              </MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </HStack>

      <EditChannel isOpen={isOpenEditModal} onClose={closeEditModal} />

      <Modal isOpen={isOpen} onClose={onClose} isCentered closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmation</ModalHeader>
          <ModalCloseButton disabled={isWidgetChannelDeleting} />
          <ModalBody>Are you sure want to delete this channel?</ModalBody>

          <ModalFooter>
            <Button disabled={isWidgetChannelDeleting} mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleDeleteWidgetChannel}
              isLoading={isWidgetChannelDeleting}
              loadingText="Deleting..."
              colorScheme="red"
              shadow="md"
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default WidgetChannel
