import { Button,
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
  useDisclosure } from '@chakra-ui/react'
import { HiDotsVertical } from 'react-icons/hi'
import { Link } from 'react-router-dom'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'
import { useRef } from 'react'
import useFetchWidgets from '@hooks/queries/widget/useFetchWidgets'
import useDeleteWidget from '@hooks/mutations/widget/useDeleteWidget'
import { Widget } from '@globalStates/Interfaces'
import useUpdateWidgetStatus from '@hooks/mutations/widget/useUpdateWidgetStatus'
import AddWidget from '@components/widget/AddWidget'
import useToaster from '@hooks/useToaster'

function Widgets() {
  const { widgets, isWidgetFetching } = useFetchWidgets()
  const { deleteWidget, isWidgetDeleting } = useDeleteWidget()
  const brandColorToggle = useColorModeValue('purple.500', 'purple.200')
  const { updateWidgetStatus, isWidgetStatusUpdating } = useUpdateWidgetStatus()
  const { isOpen, onOpen: openDelModal, onClose: closeDelModal } = useDisclosure()
  const tempWidgetId = useRef('')
  const toaster = useToaster()

  const openDeleteModal = (widgetId: string) => () => {
    tempWidgetId.current = widgetId
    openDelModal()
  }

  const handleDeleteWidget = async () => {
    await deleteWidget(tempWidgetId.current)
    closeDelModal()
  }

  const handleStatusChange = async (isChecked: boolean, widgetId: string) => {
    const { status, data } = await updateWidgetStatus(widgetId, isChecked)
    toaster(status, data)
  }

  return (
    <>
      <TableContainer borderWidth="1px" rounded="lg" shadow="md">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th colSpan={2}>
                <HStack justifyContent="space-between">
                  <HStack>
                    <Heading as="h2" size="sm" textTransform="none" my="2">
                      Widgets List
                    </Heading>
                    {(isWidgetFetching || isWidgetStatusUpdating) && <Spinner />}
                  </HStack>
                  <AddWidget />
                </HStack>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {widgets?.map((widget: Widget) => (
              <Tr key={widget.id}>
                <Td>
                  <Text display="inline-block" _hover={{ color: brandColorToggle }}>
                    <Link to={`/widgets/${widget.id}`}>{widget.name}</Link>
                  </Text>
                </Td>
                <Td textAlign="right">
                  <Switch
                    aria-label="Switch widget status"
                    disabled={isWidgetStatusUpdating}
                    isChecked={widget.status}
                    colorScheme="purple"
                    mr="2"
                    onChange={(e) => handleStatusChange(e.target.checked, widget.id)}
                  />
                  <Menu>
                    <MenuButton isRound as={IconButton} aria-label="Options" icon={<HiDotsVertical />} />
                    <MenuList shadow="lg">
                      <Link to={`/widgets/${widget.id}`}>
                        <MenuItem icon={<FiEdit2 />}>Edit</MenuItem>
                      </Link>
                      <MenuItem icon={<FiTrash2 />} color="red.600" onClick={openDeleteModal(widget.id)}>
                        Delete
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Td>
              </Tr>
            ))}

            {widgets?.length < 1 && (
              <Tr>
                <Td rowSpan={2}>No Widgets</Td>
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
            <Button onClick={handleDeleteWidget} isLoading={isWidgetDeleting} loadingText="Deleting..." colorScheme="red" shadow="md">
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default Widgets
