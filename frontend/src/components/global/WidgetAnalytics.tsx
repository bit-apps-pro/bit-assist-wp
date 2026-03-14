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
import { __ } from '@wordpress/i18n'
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
    toaster(
      status,
      status === 'error'
        ? __('Something went wrong!', 'bit-assist')
        : __('Updated successfully!', 'bit-assist')
    )
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
              {__('Widget Analytics', 'bit-assist')}
              <Switch
                aria-label={__('Switch widget status', 'bit-assist')}
                colorScheme="purple"
                disabled={isAnalyticsUpdating}
                isChecked={!!isWidgetAnalyticsActive}
                ml={4}
                onChange={e => handleSwitchEnable(e.target.checked)}
                title={
                  isWidgetAnalyticsActive
                    ? __('Analytics disable', 'bit-assist')
                    : __('Analytics enable', 'bit-assist')
                }
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
                            <option value="today">{__('Today', 'bit-assist')}</option>
                            <option value="7days">{__('Last 7 Days', 'bit-assist')}</option>
                            <option value="30days">{__('Last 30 Days', 'bit-assist')}</option>
                            <option value="all-time">{__('All Time', 'bit-assist')}</option>
                            <option value="custom">{__('Custom Date', 'bit-assist')}</option>
                          </Select>

                          {selectedFilter === 'custom' && (
                            <RangeDatepicker
                              onDateChange={setSelectedDates}
                              selectedDates={selectedDates}
                            />
                          )}
                        </HStack>
                        <Tooltip
                          label={__('Delete all analytics data', 'bit-assist')}
                          placement="left-end"
                        >
                          <Button
                            colorScheme="red"
                            leftIcon={<FiTrash2 color="red" />}
                            onClick={openDeleteModal}
                            variant="outline"
                          >
                            {__('Delete All Analytics', 'bit-assist')}
                          </Button>
                        </Tooltip>
                      </HStack>
                    </Th>
                  </Tr>
                  <Tr>
                    <Th>{__('Widget Name', 'bit-assist')}</Th>
                    <Th textAlign="center">{__('Visitors', 'bit-assist')}</Th>
                    <Th textAlign="center">{__('Total Clicks', 'bit-assist')}</Th>
                    <Th textAlign="end">{__('Click Rate', 'bit-assist')}</Th>
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
                <ModalHeader>{__('Confirmation', 'bit-assist')}</ModalHeader>
                <ModalCloseButton disabled={isAnalyticsDeleting} />
                <ModalBody>{__('Are you sure to delete all analytics data?', 'bit-assist')}</ModalBody>

                <ModalFooter>
                  <Button disabled={isAnalyticsDeleting} mr={3} onClick={closeDelModal}>
                    {__('Cancel', 'bit-assist')}
                  </Button>
                  <Button
                    colorScheme="red"
                    isLoading={isAnalyticsDeleting}
                    loadingText={__('Deleting...', 'bit-assist')}
                    onClick={handleDeleteAnalytics}
                    shadow="md"
                  >
                    {__('Delete', 'bit-assist')}
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
