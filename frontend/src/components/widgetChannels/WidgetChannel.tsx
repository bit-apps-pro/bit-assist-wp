import { DragHandleIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Flex,
  HStack,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useColorModeValue,
  useDisclosure
} from '@chakra-ui/react'
import EditChannel from '@components/widgetChannels/EditChannel'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { editWidgetChannelIdAtom } from '@globalStates/atoms'
import { type WidgetChannelType } from '@globalStates/Interfaces'
import useCopyWidgetChannel from '@hooks/mutations/widgetChannel/useCopyWidgetChannel'
import useDeleteWidgetChannel from '@hooks/mutations/widgetChannel/useDeleteWidgetChannel'
import useToaster from '@hooks/useToaster'
import { __ } from '@wordpress/i18n'
import { useAtom } from 'jotai'
import { useRef } from 'react'
import { FiCopy, FiEdit2, FiList, FiTrash2 } from 'react-icons/fi'
import { Link } from 'react-router-dom'

import channelList from './ChannelList'

interface WidgetChannelProps {
  bg?: string
  cursor?: string
  shadow?: string
  widgetChannel: WidgetChannelType
}

function WidgetChannel({
  bg = 'none',
  cursor = 'grab',
  shadow = 'none',
  widgetChannel
}: WidgetChannelProps) {
  const temporaryWidgetChannelId = useRef<number>(0)
  const [, setEditWidgetChannelId] = useAtom(editWidgetChannelIdAtom)
  const brandColorToggle = useColorModeValue('purple.500', 'purple.200')
  const channelColorToggle = useColorModeValue('white', 'gray.800')
  const { deleteWidgetChannel, isWidgetChannelDeleting } = useDeleteWidgetChannel()
  const { copyWidgetChannel } = useCopyWidgetChannel()
  const { isOpen: isOpenEditModal, onClose: closeEditModal, onOpen: openEditModal } = useDisclosure()
  const { isOpen, onClose, onOpen } = useDisclosure()
  const toaster = useToaster()

  const onOpenEditModal = (widgetChannelId: number) => () => {
    setEditWidgetChannelId(widgetChannelId)
    openEditModal()
  }

  const onCopyChannel = (widgetChannelId: number) => async () => {
    const { data, status } = await copyWidgetChannel(widgetChannelId)
    toaster(status, data)
  }

  const openDeleteModal = (widgetChannelId: number) => () => {
    temporaryWidgetChannelId.current = widgetChannelId
    onOpen()
  }

  const handleDeleteWidgetChannel = async () => {
    await deleteWidgetChannel(temporaryWidgetChannelId.current)
    onClose()
  }

  const { attributes, isDragging, listeners, setNodeRef, transform, transition } = useSortable({
    id: widgetChannel.id
  })

  const style = {
    opacity: isDragging ? 0.4 : 1,
    touchAction: 'pinch-zoom',
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <>
      <HStack
        bg={channelColorToggle}
        borderWidth={1}
        justifyContent="space-between"
        px="3"
        py="2"
        ref={setNodeRef}
        rounded="md"
        shadow={shadow}
        style={style}
        w="full"
      >
        <HStack>
          <Flex
            {...listeners}
            {...attributes}
            alignItems="center"
            bg={bg}
            cursor={cursor}
            h={8}
            justifyContent="center"
            rounded="sm"
            w={6}
          >
            <DragHandleIcon aria-label={__('draggable button', 'bit-assist')} />
          </Flex>
          <Image
            alt={widgetChannel.config.title}
            boxSize="40px"
            fallbackSrc={channelList.find(c => c.name === widgetChannel.channel_name)?.icon}
            objectFit="cover"
            rounded="full"
            src={widgetChannel.config.channel_icon}
          />
          <Text
            _hover={{ color: brandColorToggle }}
            cursor="pointer"
            display="inline-block"
            ml="2"
            onClick={onOpenEditModal(widgetChannel.id)}
          >
            {widgetChannel.config?.title}
          </Text>
        </HStack>
        <Box>
          {widgetChannel.config?.card_config?.form_fields && (
            <Link to={`/responses/${widgetChannel.id}`}>
              <Button leftIcon={<FiList />} size="sm" variant="ghost">
                {__('Responses', 'bit-assist')}
              </Button>
            </Link>
          )}

          <Button
            leftIcon={<FiEdit2 />}
            onClick={onOpenEditModal(widgetChannel.id)}
            size="sm"
            variant="ghost"
          >
            {__('Edit', 'bit-assist')}
          </Button>

          <Button
            leftIcon={<FiCopy />}
            onClick={onCopyChannel(widgetChannel.id)}
            size="sm"
            variant="ghost"
          >
            {__('Duplicate', 'bit-assist')}
          </Button>

          <Button
            colorScheme="red"
            leftIcon={<FiTrash2 />}
            onClick={openDeleteModal(widgetChannel.id)}
            size="sm"
            variant="ghost"
          >
            {__('Delete', 'bit-assist')}
          </Button>
        </Box>
      </HStack>

      <EditChannel isOpen={isOpenEditModal} onClose={closeEditModal} />

      <Modal closeOnOverlayClick={false} isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{__('Confirmation', 'bit-assist')}</ModalHeader>
          <ModalCloseButton disabled={isWidgetChannelDeleting} />
          <ModalBody>{__('Are you sure want to delete this channel?', 'bit-assist')}</ModalBody>

          <ModalFooter>
            <Button disabled={isWidgetChannelDeleting} mr={3} onClick={onClose}>
              {__('Cancel', 'bit-assist')}
            </Button>
            <Button
              colorScheme="red"
              isLoading={isWidgetChannelDeleting}
              loadingText={__('Deleting', 'bit-assist') + '...'}
              onClick={handleDeleteWidgetChannel}
              shadow="md"
            >
              {__('Delete', 'bit-assist')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default WidgetChannel
