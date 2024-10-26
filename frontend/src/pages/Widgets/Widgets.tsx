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
  useDisclosure,
} from '@chakra-ui/react'
import { HiDotsVertical, HiPlus } from 'react-icons/hi'
import { Link } from 'react-router-dom'
import { FiCopy, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { useRef } from 'react'
import useFetchWidgets from '@hooks/queries/widget/useFetchWidgets'
import useDeleteWidget from '@hooks/mutations/widget/useDeleteWidget'
import { Widget } from '@globalStates/Interfaces'
import useUpdateWidgetStatus from '@hooks/mutations/widget/useUpdateWidgetStatus'
import AddWidget from '@components/widget/AddWidget'
import useToaster from '@hooks/useToaster'
import useWidgetActive from '@hooks/mutations/widget/useWidgetActive'
import ProModal from '@components/global/ProModal'
import { useAtom } from 'jotai'
import { freeLimitsAtom } from '@globalStates/atoms'
import config from '@config/config'
import useCopyWidget from '@hooks/mutations/widget/useCopyWidget'
import WidgetAnalytics from '@components/global/WidgetAnalytics'

function Widgets() {
  const { widgets, isWidgetFetching } = useFetchWidgets()
  const { deleteWidget, isWidgetDeleting } = useDeleteWidget()
  const brandColorToggle = useColorModeValue('purple.500', 'purple.200')
  const ThColorToggle = useColorModeValue('gray.50', 'gray.700')
  const { updateWidgetStatus, isWidgetStatusUpdating } = useUpdateWidgetStatus()
  const { copyWidget, isWidgetCoping } = useCopyWidget()
  const { updateWidgetActive } = useWidgetActive()
  const { isOpen, onOpen: openDelModal, onClose: closeDelModal } = useDisclosure()
  const tempWidgetId = useRef('')
  const toaster = useToaster()
  const [freeLimit] = useAtom(freeLimitsAtom)

  const openDeleteModal = (widgetId: string) => () => {
    tempWidgetId.current = widgetId
    openDelModal()
  }

  const onCopyWidget = (widgetId: string) => async () => {
    const { status, data } = await copyWidget(widgetId)
    toaster(status, data)
  }

  const handleDeleteWidget = async () => {
    const { status, data } = await deleteWidget(tempWidgetId.current)
    toaster(status, data)
    closeDelModal()
  }

  const handleStatusChange = async (isChecked: boolean, widgetId: string) => {
    const { status, data } = await updateWidgetStatus(widgetId, isChecked)
    toaster(status, data)
  }

  const handleChange = async (value: string, widgetId: string) => {
    const { status, data } = await updateWidgetActive(widgetId, +value)
    toaster(status, data)
  }

  return (
    <>
      <TableContainer borderWidth="1px" rounded="lg" shadow="md" mt="2">
        <Table variant="simple" size="sm">
          <Thead bgColor={ThColorToggle}>
            <Tr>
              <Th colSpan={4} py="3">
                <HStack justifyContent="space-between">
                  <HStack>
                    <Heading as="h2" size="sm" textTransform="none" my="2">
                      Widgets List
                    </Heading>
                    {(isWidgetFetching || isWidgetStatusUpdating) && <Spinner />}
                  </HStack>
                  {!config.IS_PRO && widgets?.length >= freeLimit.widget ? (
                    <ProModal type="widget" number={freeLimit.widget} text="Add Widget" icon={<HiPlus />} />
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
                      colorScheme="purple"
                      aria-label="Switch widget status"
                      disabled={isWidgetStatusUpdating}
                      isChecked={widget.status}
                      onChange={(e) => handleStatusChange(e.target.checked, widget.id)}
                      title={widget.status ? 'Widget disable' : 'Widget enable'}
                    />
                  </Td>
                  <Td>
                    <Text display="inline-block" fontSize="md" _hover={{ color: brandColorToggle }}>
                      <Link to={`/widgets/${widget.id}`}>{widget.name || 'Untitled Widget'}</Link>
                    </Text>
                  </Td>
                  <Td>{new Date(widget.created_at).toLocaleDateString()}</Td>

                  <Td textAlign="right" w="10">
                    <Select
                      w="28"
                      mr="4"
                      display="inline-block"
                      value={widget.active ? 1 : 0}
                      disabled={config.IS_PRO ? !widget.status : true}
                      onChange={(e) => handleChange(e.target.value, widget.id)}
                      className={`chipSelect ${widget.active ? 'active' : ''}`}
                      size="sm"
                    >
                      <option value="1">This site</option>
                      <option value="0">External site</option>
                    </Select>

                    <Menu>
                      <MenuButton isRound as={IconButton} aria-label="Options" icon={<HiDotsVertical />} />
                      <MenuList shadow="lg">
                        <Link to={`/widgets/${widget.id}`}>
                          <MenuItem icon={<FiEdit2 />}>Edit</MenuItem>
                        </Link>
                        <MenuItem icon={<FiCopy />} onClick={onCopyWidget(widget.id)}>
                          Duplicate
                        </MenuItem>
                        <MenuItem icon={<FiTrash2 />} color="red.600" onClick={openDeleteModal(widget.id)}>
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
                  <Text fontSize="md" color="gray.500" align="center">
                    No widgets found! Create a new widget.
                  </Text>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>

      <Modal isOpen={isOpen} onClose={closeDelModal} isCentered>
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
              onClick={handleDeleteWidget}
              isLoading={isWidgetDeleting}
              loadingText="Deleting..."
              colorScheme="red"
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
