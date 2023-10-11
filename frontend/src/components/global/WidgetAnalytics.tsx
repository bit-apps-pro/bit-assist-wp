import {
  useColorModeValue,
  Switch,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  HStack,
  Spinner,
  Heading,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Tooltip,
  Select,
  Box,
} from '@chakra-ui/react'
import useToaster from '@hooks/useToaster'
import ProWrapper from '@components/global/ProWrapper'
import useUpdateAnalytics from '@hooks/mutations/analytics/useUpdateAnalytics'
import useFetchAnalytics from '@hooks/queries/analytics/useFetchAnalytics'
import { FiTrash2 } from 'react-icons/fi'
import useDeleteAnalytics from '@hooks/mutations/analytics/useDeleteAnalytics'
import { useState } from 'react'
import { RangeDatepicker } from 'chakra-dayzed-datepicker'
import useFetchIsAnalyticsActive from '@hooks/queries/analytics/useFetchIsAnalyticsActive'
import config from '@config/config'

function WidgetAnalytics({ widgetLength }: { widgetLength: number }) {
  const toaster = useToaster()
  const ThColorToggle = useColorModeValue('gray.50', 'gray.700')
  const { isOpen, onOpen: openDelModal, onClose: closeDelModal } = useDisclosure()
  const { isAnalyticsActive, isFetching } = useFetchIsAnalyticsActive()
  const { updateAnalytics, isAnalyticsUpdating } = useUpdateAnalytics()
  const { deleteAnalytics, isAnalyticsDeleting } = useDeleteAnalytics()

  const [selectedFilter, setSelectedFilter] = useState('all-time')
  const [selectedDates, setSelectedDates] = useState<Date[]>([new Date(), new Date()])
  const filterValue = selectedFilter !== 'custom' ? selectedFilter : selectedDates
  const { analytics, isAnalyticsFetching } = useFetchAnalytics(filterValue)

  const isWidgetAnalyticsActive = isAnalyticsActive === 1

  const handleSwitchEnable = async (isChecked: boolean) => {
    const widgetAnalytics = isChecked ? 1 : 0
    const { status } = await updateAnalytics(widgetAnalytics)
    toaster(status, status !== 'error' ? 'Updated successfully!' : 'Something went wrong!')
  }

  const handleSelectChange = async (value: string) => {
    setSelectedFilter(value)
  }

  const handleDeleteAnalytics = async () => {
    const { status, data } = await deleteAnalytics()
    toaster(status, data)
    closeDelModal()
  }

  const openDeleteModal = () => () => {
    openDelModal()
  }

  if (widgetLength < 1) {
    return null
  }

  return (
    <Box mt="6">
      <ProWrapper>
        <HStack justifyContent="space-between">
          <HStack>
            <Heading as="h2" size="sm" mb="2">
              Widget Analytics
              <Switch
                aria-label="Switch widget status"
                colorScheme="purple"
                disabled={isAnalyticsUpdating}
                ml={4}
                isChecked={!!isWidgetAnalyticsActive}
                onChange={(e) => handleSwitchEnable(e.target.checked)}
                title={isWidgetAnalyticsActive ? 'Analytics disable' : 'Analytics enable'}
              />
            </Heading>
            {(isFetching || isAnalyticsFetching || isAnalyticsUpdating) && <Spinner ml={2} />}
          </HStack>
        </HStack>

        {isWidgetAnalyticsActive && config.IS_PRO && (
          <>
            <TableContainer borderWidth="1px" rounded="lg" shadow="md" mt="2">
              <Table variant="simple">
                <Thead bgColor={ThColorToggle}>
                  <Tr>
                    <Th colSpan={4} py="3">
                      <HStack justifyContent="space-between">
                        <HStack>
                          <Select
                            style={{ width: 'inherit' }}
                            w="36"
                            value={selectedFilter}
                            variant="outline"
                            onChange={(e) => handleSelectChange(e.target.value)}
                          >
                            <option value="today">Today</option>
                            <option value="7days">Last 7 Days</option>
                            <option value="30days">Last 30 Days</option>
                            <option value="all-time">All Time</option>
                            <option value="custom">Custom Date</option>
                          </Select>

                          {selectedFilter === 'custom' && (
                            <RangeDatepicker selectedDates={selectedDates} onDateChange={setSelectedDates} />
                          )}
                        </HStack>
                        <Tooltip label="Delete all analytics data" placement="left-end">
                          <Button variant="outline" onClick={openDeleteModal()} leftIcon={<FiTrash2 color="red" />}>
                            Delete
                          </Button>
                        </Tooltip>
                      </HStack>
                    </Th>
                  </Tr>
                  <Tr>
                    <Th>Widget Name</Th>
                    <Th textAlign="center">Visitors</Th>
                    <Th textAlign="center">Total Clicks</Th>
                    <Th textAlign="end">Click Rate</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {analytics?.data?.map((item: any) => (
                    <Tr key={item.widget_id}>
                      <Td>{item.name}</Td>
                      <Td textAlign="center">{+item.visitor_count}</Td>
                      <Td textAlign="center">{+item.click_count}</Td>
                      <Td textAlign="center" width="1">
                        {+item.visitor_count !== 0 ? ((100 / +item.visitor_count) * +item.click_count).toFixed(0) : 0}%
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>

            <Modal isOpen={isOpen} onClose={closeDelModal} isCentered>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Confirmation</ModalHeader>
                <ModalCloseButton disabled={isAnalyticsDeleting} />
                <ModalBody>Are you sure to delete all analytics data?</ModalBody>

                <ModalFooter>
                  <Button disabled={isAnalyticsDeleting} mr={3} onClick={closeDelModal}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDeleteAnalytics}
                    isLoading={isAnalyticsDeleting}
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
        )}
      </ProWrapper>
    </Box>
  )
}
export default WidgetAnalytics
