import { Box, useColorModeValue, Table, Thead, Tbody, Tr, Th, Td, TableCaption, TableContainer } from '@chakra-ui/react'
import Title from '@components/global/Title'
import { widgetAtom } from '@globalStates/atoms'
import { useAtom, useAtomValue } from 'jotai'
import ProWrapper from '@components/global/ProWrapper'
import useFetchAnalytics from '@hooks/queries/analytics/useFetchAnalytics'
import useFetchChannelAnalytics from '@hooks/queries/analytics/useFetchChannelAnalytics'

function ChannelAnalytics() {
  const widget = useAtomValue(widgetAtom)
  const ThColorToggle = useColorModeValue('gray.50', 'gray.700')
  const activeAnalytics = useFetchAnalytics()
  const channelAnalyticsData = useFetchChannelAnalytics(widget?.id)

  if (activeAnalytics?.analytics?.widget_analytics === 0) {
    return null
  }

  return (
    <>
      <TableContainer borderWidth="1px" rounded="lg" shadow="md">
        <Table variant="simple">
          <TableCaption>Showing Channel Analytics</TableCaption>
          <Thead bgColor={ThColorToggle}>
            <Tr>
              <Th>Channel Name</Th>
              <Th textAlign="center">Visitors</Th>
              <Th textAlign="center">Total Clicks</Th>
              <Th textAlign="center">Click Rate</Th>
            </Tr>
          </Thead>
          {channelAnalyticsData?.analytics?.data?.length > 0 && (
            <Tbody>
              {channelAnalyticsData?.analytics?.data?.map((item: any) => (
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
          )}
        </Table>
      </TableContainer>
    </>
  )
}
export default ChannelAnalytics
