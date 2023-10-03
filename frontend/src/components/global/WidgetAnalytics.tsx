import {
  useColorModeValue,
  Switch,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  HStack,
  Spinner,
  Heading,
} from '@chakra-ui/react'
import useToaster from '@hooks/useToaster'
import ProWrapper from '@components/global/ProWrapper'
import useUpdateAnalytics from '@hooks/mutations/analytics/useUpdateAnalytics'
import useFetchAnalytics from '@hooks/queries/analytics/useFetchAnalytics'

function WidgetAnalytics() {
  const toaster = useToaster()
  const { analytics, isAnalyticsFetching } = useFetchAnalytics()
  const { updateAnalytics, isAnalyticsUpdating } = useUpdateAnalytics()
  const ThColorToggle = useColorModeValue('gray.50', 'gray.700')
  const isWidgetAnalyticsActive = analytics?.widget_analytics === 1

  const handleSwitchEnable = async (isChecked: boolean) => {
    const widgetAnalytics = isChecked ? 1 : 0
    const { status } = await updateAnalytics(widgetAnalytics)
    toaster(status, status !== 'error' ? 'Updated successfully!' : 'Something went wrong!')
  }

  return (
    <>
      <ProWrapper>
        <HStack justifyContent="space-between">
          <HStack mt={6}>
            <Heading as="h1" size="sm" textTransform="none" my="2">
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
            {(isAnalyticsFetching || isAnalyticsUpdating) && <Spinner ml={2} />}
          </HStack>
        </HStack>
      </ProWrapper>
      {isWidgetAnalyticsActive && (
        <>
          <TableContainer borderWidth="1px" rounded="lg" shadow="md" mt="2">
            <Table variant="simple">
              <TableCaption>Showing Widget Analytics</TableCaption>
              <Thead bgColor={ThColorToggle}>
                <Tr>
                  <Th>Widget Name</Th>
                  <Th textAlign="center">Visitors</Th>
                  <Th textAlign="center">Total Clicks</Th>
                  <Th textAlign="center">Click Rate</Th>
                </Tr>
              </Thead>
              <Tbody>
                {analytics?.data?.map((item: any) => (
                  <Tr key={item.widget_id}>
                    <Td>{item.name}</Td>
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
      )}
    </>
  )
}
export default WidgetAnalytics
