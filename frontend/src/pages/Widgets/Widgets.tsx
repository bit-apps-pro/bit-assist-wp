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
import ProModal from '@components/global/ProModal'
import WidgetAnalytics from '@components/global/WidgetAnalytics'
import AddWidget from '@components/widget/AddWidget'
import config from '@config/config'
import { freeLimitsAtom } from '@globalStates/atoms'
import { type Widget } from '@globalStates/Interfaces'
import useCopyWidget from '@hooks/mutations/widget/useCopyWidget'
import useDeleteWidget from '@hooks/mutations/widget/useDeleteWidget'
import useUpdateWidgetStatus from '@hooks/mutations/widget/useUpdateWidgetStatus'
import useWidgetActive from '@hooks/mutations/widget/useWidgetActive'
import useFetchWidgets from '@hooks/queries/widget/useFetchWidgets'
import useToaster from '@hooks/useToaster'
import { useAtom } from 'jotai'
import { useRef } from 'react'
import { FiCopy, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { HiDotsVertical, HiPlus } from 'react-icons/hi'
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
  const [freeLimit] = useAtom(freeLimitsAtom)

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
                      Widgets List
                    </Heading>
                    {(isWidgetFetching || isWidgetStatusUpdating) && <Spinner />}
                  </HStack>
                  {!config.IS_PRO && widgets?.length >= freeLimit.widget ? (
                    <ProModal
                      icon={<HiPlus />}
                      number={freeLimit.widget}
                      text="Add Widget"
                      type="widget"
                    />
                  ) : (
                    <AddWidget />
                  )}
                </HStack>
              </Th>
            </Tr>
            <Tr>
              <Th py="2">status</Th>
              <Th py="2">widget name</Th>
              <Th py="2">created at</Th>
              <Th py="2">use widget in</Th>
            </Tr>
          </Thead>
          <Tbody>
            {widgets &&
              widgets.map((widget: Widget) => (
                <Tr key={widget.id}>
                  <Td w="10">
                    <Switch
                      aria-label="Switch widget status"
                      colorScheme="purple"
                      disabled={isWidgetStatusUpdating}
                      isChecked={widget.status}
                      onChange={e => handleStatusChange(e.target.checked, widget.id)}
                      title={widget.status ? 'Widget disable' : 'Widget enable'}
                    />
                  </Td>
                  <Td>
                    <Text _hover={{ color: brandColorToggle }} display="inline-block" fontSize="md">
                      <Link to={`/widgets/${widget.id}`}>{widget.name || 'Untitled Widget'}</Link>
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
                      <option value="1">This site</option>
                      <option value="0">External site</option>
                    </Select>

                    <Menu>
                      <MenuButton
                        aria-label="Options"
                        as={IconButton}
                        icon={<HiDotsVertical />}
                        isRound
                      />
                      <MenuList shadow="lg">
                        <Link to={`/widgets/${widget.id}`}>
                          <MenuItem icon={<FiEdit2 />}>Edit</MenuItem>
                        </Link>
                        <MenuItem icon={<FiCopy />} onClick={onCopyWidget(widget.id)}>
                          Duplicate
                        </MenuItem>
                        <MenuItem
                          color="red.600"
                          icon={<FiTrash2 />}
                          onClick={openDeleteModal(widget.id)}
                        >
                          Delete
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
                    No widgets found! Create a new widget.
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
          <ModalHeader>Confirmation</ModalHeader>
          <ModalCloseButton disabled={isWidgetDeleting} />
          <ModalBody>Are you sure want to delete this widget?</ModalBody>

          <ModalFooter>
            <Button disabled={isWidgetDeleting} mr={3} onClick={closeDelModal}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              isLoading={isWidgetDeleting}
              loadingText="Deleting..."
              onClick={handleDeleteWidget}
              shadow="md"
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <WidgetAnalytics widgetLength={widgets?.length} />
    </>
  )
}

export default Widgets
