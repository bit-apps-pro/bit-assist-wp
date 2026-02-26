import {
  HStack,
  Select,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue
} from '@chakra-ui/react'
import { widgetAtom } from '@globalStates/atoms'
import useFetchChannelAnalytics from '@hooks/queries/analytics/useFetchChannelAnalytics'
import useFetchIsAnalyticsActive from '@hooks/queries/analytics/useFetchIsAnalyticsActive'
import { __ } from '@wordpress/i18n'
import { RangeDatepicker } from 'chakra-dayzed-datepicker'
import { useAtomValue } from 'jotai'
import { useState } from 'react'

interface AnalyticsItem {
  channel_id: string
  click_count: number
  title: string
  visitor_count: number
}

function ChannelAnalytics() {
  const widget = useAtomValue(widgetAtom)
  const ThColorToggle = useColorModeValue('gray.50', 'gray.700')
  const { isAnalyticsActive } = useFetchIsAnalyticsActive()

  const [selectedFilter, setSelectedFilter] = useState('all-time')
  const [selectedDates, setSelectedDates] = useState<Date[]>([new Date(), new Date()])
  const filterValue = selectedFilter === 'custom' ? selectedDates : selectedFilter
  const filterOptions = { filterValue, widget_id: widget?.id }
  const { analytics } = useFetchChannelAnalytics(filterOptions)

  const handleSelectChange = async (value: string) => {
    setSelectedFilter(value)
  }

  if (isAnalyticsActive === 0) {
    return
  }

  return (
    <>
      <TableContainer borderWidth="1px" rounded="lg">
        <Table variant="simple">
          <TableCaption>
            {analytics?.data?.length > 0
              ? __('Showing Channel Analytics', 'bit-assist')
              : __('No Analytics Data Found', 'bit-assist')}
          </TableCaption>
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
                      <RangeDatepicker onDateChange={setSelectedDates} selectedDates={selectedDates} />
                    )}
                  </HStack>
                </HStack>
              </Th>
            </Tr>
            <Tr>
              <Th>{__('Channel Name', 'bit-assist')}</Th>
              <Th textAlign="center">{__('Visitors', 'bit-assist')}</Th>
              <Th textAlign="center">{__('Total Clicks', 'bit-assist')}</Th>
              <Th textAlign="center">{__('Click Rate', 'bit-assist')}</Th>
            </Tr>
          </Thead>

          <Tbody>
            {analytics?.data?.map((item: AnalyticsItem) => (
              <Tr key={item.channel_id}>
                <Td>{item.title}</Td>
                <Td textAlign="center">{+item.visitor_count}</Td>
                <Td textAlign="center">{+item.click_count}</Td>
                <Td textAlign="center">
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
    </>
  )
}
export default ChannelAnalytics
