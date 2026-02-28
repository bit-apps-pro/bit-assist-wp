import {
  Button,
  Heading,
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
  Select,
  Spinner,
  Switch,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useDisclosure
} from '@chakra-ui/react'
import WidgetAnalytics from '@components/global/WidgetAnalytics'
import AddWidget from '@components/widget/AddWidget'
import config from '@config/config'
import { type Widget } from '@globalStates/Interfaces'
import useCopyWidget from '@hooks/mutations/widget/useCopyWidget'
import useDeleteWidget from '@hooks/mutations/widget/useDeleteWidget'
import useUpdateWidgetStatus from '@hooks/mutations/widget/useUpdateWidgetStatus'
import useWidgetActive from '@hooks/mutations/widget/useWidgetActive'
import useFetchWidgets from '@hooks/queries/widget/useFetchWidgets'
import useToaster from '@hooks/useToaster'
import { __ } from '@wordpress/i18n'
import { useRef } from 'react'
import { FiCopy, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { HiDotsVertical } from 'react-icons/hi'
import { Link } from 'react-router-dom'

function Widgets() {
  const { isWidgetFetching, widgets } = useFetchWidgets()
  const { deleteWidget, isWidgetDeleting } = useDeleteWidget()
  const brandColorToggle = useColorModeValue('purple.500', 'purple.200')
  const ThColorToggle = useColorModeValue('gray.50', 'gray.700')
  const { isWidgetStatusUpdating, updateWidgetStatus } = useUpdateWidgetStatus()
  const { copyWidget } = useCopyWidget()
  const { updateWidgetActive } = useWidgetActive()
  const { isOpen, onClose: closeDelModal, onOpen: openDelModal } = useDisclosure()
  const temporaryWidgetId = useRef('')
  const toaster = useToaster()

  const openDeleteModal = (widgetId: string) => () => {
    temporaryWidgetId.current = widgetId
    openDelModal()
  }

  const onCopyWidget = (widgetId: string) => async () => {
    const { data, status } = await copyWidget(widgetId)
    toaster(status, data)
  }

  const handleDeleteWidget = async () => {
    const { data, status } = await deleteWidget(temporaryWidgetId.current)
    toaster(status, data)
    closeDelModal()
  }

  const handleStatusChange = async (isChecked: boolean, widgetId: string) => {
    const { data, status } = await updateWidgetStatus(widgetId, isChecked)
    toaster(status, data)
  }

  const handleChange = async (value: string, widgetId: string) => {
    const { data, status } = await updateWidgetActive(widgetId, +value)
    toaster(status, data)
  }

  return (
    <>
      <TableContainer borderWidth="1px" mt="2" rounded="lg" shadow="md">
        <Table size="sm" variant="simple">
          <Thead bgColor={ThColorToggle}>
            <Tr>
              <Th colSpan={4} py="3">
                <HStack justifyContent="space-between">
                  <HStack>
                    <Heading as="h2" my="2" size="sm" textTransform="none">
                      {__('Widgets List', 'bit-assist')}
                    </Heading>
                    {(isWidgetFetching || isWidgetStatusUpdating) && <Spinner />}
                  </HStack>
                  <AddWidget />
                </HStack>
              </Th>
            </Tr>
            <Tr>
              <Th py="2">{__('status', 'bit-assist')}</Th>
              <Th py="2">{__('widget name', 'bit-assist')}</Th>
              <Th py="2">{__('created at', 'bit-assist')}</Th>
              <Th py="2">{__('use widget in', 'bit-assist')}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {widgets &&
              widgets.map((widget: Widget) => (
                <Tr key={widget.id}>
                  <Td w="10">
                    <Switch
                      aria-label={__('Switch widget status', 'bit-assist')}
                      colorScheme="purple"
                      disabled={isWidgetStatusUpdating}
                      isChecked={widget.status}
                      onChange={e => handleStatusChange(e.target.checked, widget.id)}
                      title={
                        widget.status
                          ? __('Widget disable', 'bit-assist')
                          : __('Widget enable', 'bit-assist')
                      }
                    />
                  </Td>
                  <Td>
                    <Text _hover={{ color: brandColorToggle }} display="inline-block" fontSize="md">
                      <Link to={`/widgets/${widget.id}`}>
                        {widget.name || __('Untitled Widget', 'bit-assist')}
                      </Link>
                    </Text>
                  </Td>
                  <Td>{new Date(widget.created_at).toLocaleDateString()}</Td>

                  <Td textAlign="right" w="10">
                    <Select
                      className={`chipSelect ${widget.active ? 'active' : ''}`}
                      disabled={config.IS_PRO ? !widget.status : true}
                      display="inline-block"
                      mr="4"
                      onChange={e => handleChange(e.target.value, widget.id)}
                      size="sm"
                      value={widget.active ? 1 : 0}
                      w="28"
                    >
                      <option value="1">{__('This site', 'bit-assist')}</option>
                      <option value="0">{__('External site', 'bit-assist')}</option>
                    </Select>

                    <Menu>
                      <MenuButton
                        aria-label={__('Options', 'bit-assist')}
                        as={IconButton}
                        icon={<HiDotsVertical />}
                        isRound
                      />
                      <MenuList shadow="lg">
                        <Link to={`/widgets/${widget.id}`}>
                          <MenuItem icon={<FiEdit2 />}>{__('Edit', 'bit-assist')}</MenuItem>
                        </Link>
                        <MenuItem icon={<FiCopy />} onClick={onCopyWidget(widget.id)}>
                          {__('Duplicate', 'bit-assist')}
                        </MenuItem>
                        <MenuItem
                          color="red.600"
                          icon={<FiTrash2 />}
                          onClick={openDeleteModal(widget.id)}
                        >
                          {__('Delete', 'bit-assist')}
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Td>
                </Tr>
              ))}

            {(!widgets || widgets?.length < 1) && (
              <Tr>
                <Td colSpan={4}>
                  <Text align="center" color="gray.500" fontSize="md">
                    {__('No widgets found! Create a new widget.', 'bit-assist')}
                  </Text>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>

      <Modal isCentered isOpen={isOpen} onClose={closeDelModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{__('Confirmation', 'bit-assist')}</ModalHeader>
          <ModalCloseButton disabled={isWidgetDeleting} />
          <ModalBody>{__('Are you sure want to delete this widget?', 'bit-assist')}</ModalBody>

          <ModalFooter>
            <Button disabled={isWidgetDeleting} mr={3} onClick={closeDelModal}>
              {__('Cancel', 'bit-assist')}
            </Button>
            <Button
              colorScheme="red"
              isLoading={isWidgetDeleting}
              loadingText={__('Deleting...', 'bit-assist')}
              onClick={handleDeleteWidget}
              shadow="md"
            >
              {__('Delete', 'bit-assist')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <WidgetAnalytics widgetLength={widgets?.length} />
    </>
  )
}

export default Widgets
