import {
  Box,
  Button,
  Heading,
  HStack,
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
  Th,
  Thead,
  Tooltip,
  Tr,
  useColorModeValue,
  useDisclosure
} from '@chakra-ui/react'
import ProWrapper from '@components/global/ProWrapper'
import config from '@config/config'
import useDeleteAnalytics from '@hooks/mutations/analytics/useDeleteAnalytics'
import useUpdateAnalytics from '@hooks/mutations/analytics/useUpdateAnalytics'
import useFetchAnalytics from '@hooks/queries/analytics/useFetchAnalytics'
import useFetchIsAnalyticsActive from '@hooks/queries/analytics/useFetchIsAnalyticsActive'
import useToaster from '@hooks/useToaster'
import { RangeDatepicker } from 'chakra-dayzed-datepicker'
import { useState } from 'react'
import { FiTrash2 } from 'react-icons/fi'

interface AnalyticsItem {
  click_count: number
  name: string
  visitor_count: number
  widget_id: number
}

function WidgetAnalytics({ widgetLength }: { widgetLength: number }) {
  const toaster = useToaster()
  const ThColorToggle = useColorModeValue('gray.50', 'gray.700')
  const { isOpen, onClose: closeDelModal, onOpen: openDelModal } = useDisclosure()
  const { isAnalyticsActive, isFetching } = useFetchIsAnalyticsActive()
  const { isAnalyticsUpdating, updateAnalytics } = useUpdateAnalytics()
  const { deleteAnalytics, isAnalyticsDeleting } = useDeleteAnalytics()

  const [selectedFilter, setSelectedFilter] = useState('all-time')
  const [selectedDates, setSelectedDates] = useState<Date[]>([new Date(), new Date()])
  const filterValue = selectedFilter === 'custom' ? selectedDates : selectedFilter
  const { analytics, isAnalyticsFetching } = useFetchAnalytics(filterValue)

  const isWidgetAnalyticsActive = isAnalyticsActive === 1

  const handleSwitchEnable = async (isChecked: boolean) => {
    const widgetAnalytics = isChecked ? 1 : 0
    const { status } = await updateAnalytics(widgetAnalytics)
    toaster(status, status === 'error' ? 'Something went wrong!' : 'Updated successfully!')
  }

  const handleSelectChange = async (value: string) => {
    setSelectedFilter(value)
  }

  const handleDeleteAnalytics = async () => {
    const { data, status } = await deleteAnalytics()
    toaster(status, data)
    closeDelModal()
  }

  const openDeleteModal = () => {
    openDelModal()
  }

  if (widgetLength < 1) {
    return
  }

  return (
    <Box mt="6">
      <ProWrapper>
        <HStack justifyContent="space-between">
          <HStack>
            <Heading as="h2" mb="2" size="sm">
              Widget Analytics
              <Switch
                aria-label="Switch widget status"
                colorScheme="purple"
                disabled={isAnalyticsUpdating}
                isChecked={!!isWidgetAnalyticsActive}
                ml={4}
                onChange={e => handleSwitchEnable(e.target.checked)}
                title={isWidgetAnalyticsActive ? 'Analytics disable' : 'Analytics enable'}
              />
            </Heading>
            {(isFetching || isAnalyticsFetching || isAnalyticsUpdating) && <Spinner ml={2} />}
          </HStack>
        </HStack>

        {isWidgetAnalyticsActive && config.IS_PRO && (
          <>
            <TableContainer borderWidth="1px" mt="2" rounded="lg" shadow="md">
              <Table variant="simple">
                <Thead bgColor={ThColorToggle}>
                  <Tr>
                    <Th colSpan={4} py="3">
                      <HStack justifyContent="space-between">
                        <HStack>
                          <Select
                            onChange={e => handleSelectChange(e.target.value)}
                            style={{ width: 'inherit' }}
                            value={selectedFilter}
                            variant="outline"
                            w="36"
                          >
                            <option value="today">Today</option>
                            <option value="7days">Last 7 Days</option>
                            <option value="30days">Last 30 Days</option>
                            <option value="all-time">All Time</option>
                            <option value="custom">Custom Date</option>
                          </Select>

                          {selectedFilter === 'custom' && (
                            <RangeDatepicker
                              onDateChange={setSelectedDates}
                              selectedDates={selectedDates}
                            />
                          )}
                        </HStack>
                        <Tooltip label="Delete all analytics data" placement="left-end">
                          <Button
                            colorScheme="red"
                            leftIcon={<FiTrash2 color="red" />}
                            onClick={openDeleteModal}
                            variant="outline"
                          >
                            Delete All Analytics
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
                  {analytics?.data?.map((item: AnalyticsItem) => (
                    <Tr key={item.widget_id}>
                      <Td>{item.name}</Td>
                      <Td textAlign="center">{+item.visitor_count}</Td>
                      <Td textAlign="center">{+item.click_count}</Td>
                      <Td textAlign="center" width="1">
                        {+item.visitor_count === 0
                          ? 0
                          : ((100 / +item.visitor_count) * +item.click_count).toFixed(0)}
                        %
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>

            <Modal isCentered isOpen={isOpen} onClose={closeDelModal}>
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
                    colorScheme="red"
                    isLoading={isAnalyticsDeleting}
                    loadingText="Deleting..."
                    onClick={handleDeleteAnalytics}
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
