import {
  useColorModeValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  HStack,
  Select,
} from '@chakra-ui/react'
import { widgetAtom } from '@globalStates/atoms'
import { useAtomValue } from 'jotai'
import useFetchChannelAnalytics from '@hooks/queries/analytics/useFetchChannelAnalytics'
import useFetchIsAnalyticsActive from '@hooks/queries/analytics/useFetchIsAnalyticsActive'
import { RangeDatepicker } from 'chakra-dayzed-datepicker'
import { useState } from 'react'

function ChannelAnalytics() {
  const widget = useAtomValue(widgetAtom)
  const ThColorToggle = useColorModeValue('gray.50', 'gray.700')
  const { isAnalyticsActive } = useFetchIsAnalyticsActive()

  const [selectedFilter, setSelectedFilter] = useState('all-time')
  const [selectedDates, setSelectedDates] = useState<Date[]>([new Date(), new Date()])
  const filterValue = selectedFilter !== 'custom' ? selectedFilter : selectedDates
  const filterOptions = { widget_id: widget?.id, filterValue }
  const { analytics } = useFetchChannelAnalytics(filterOptions)

  const handleSelectChange = async (value: string) => {
    setSelectedFilter(value)
  }

  if (isAnalyticsActive === 0) {
    return null
  }

  return (
    <>
      <TableContainer borderWidth="1px" rounded="lg">
        <Table variant="simple">
          <TableCaption>
            {analytics?.data?.length > 0 ? 'Showing Channel Analytics' : 'No Analytics Data Found'}
          </TableCaption>
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
                </HStack>
              </Th>
            </Tr>
            <Tr>
              <Th>Channel Name</Th>
              <Th textAlign="center">Visitors</Th>
              <Th textAlign="center">Total Clicks</Th>
              <Th textAlign="center">Click Rate</Th>
            </Tr>
          </Thead>

          <Tbody>
            {analytics?.data?.map((item: any) => (
              <Tr key={item.channel_id}>
                <Td>{item.title}</Td>
                <Td textAlign="center">{+item.visitor_count}</Td>
                <Td textAlign="center">{+item.click_count}</Td>
                <Td textAlign="center">
                  {+item.visitor_count !== 0 ? ((100 / +item.visitor_count) * +item.click_count).toFixed(0) : 0}%
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  )
}
export default ChannelAnalytics
