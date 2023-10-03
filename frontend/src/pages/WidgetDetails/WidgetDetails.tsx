import { Tab, TabList, TabPanel, TabPanels, Tabs, useColorModeValue } from '@chakra-ui/react'
import Customizations from '@components/customizations/Customizations'
import Publish from '@components/publish/Publish'
import WidgetChannels from '@components/widgetChannels/WidgetChannels'
import Settings from '@components/settings/Settings'
import useFetchWidget from '@hooks/queries/widget/useFetchWidget'
import ChannelAnalytics from '@components/global/ChannelAnalytics'
import useFetchAnalytics from '@hooks/queries/analytics/useFetchAnalytics'

function WidgetDetails() {
  useFetchWidget()
  const tabColorMode = useColorModeValue('rgba(255, 255, 255, 0.75)', 'rgba(26,32,44,0.75)')
  const analyticsActive = useFetchAnalytics()

  return (
    <Tabs variant="solid-rounded" colorScheme="purple">
      <TabList
        gap={['1', '2']}
        justifyContent="center"
        flexWrap="wrap"
        position="sticky"
        top="32px"
        py="2"
        zIndex={2}
        bg={tabColorMode}
        backdropFilter="blur(10px)"
      >
        {analyticsActive?.analytics?.widget_analytics === 1 && <Tab rounded="md">Analytics</Tab>}
        <Tab rounded="md">Channels</Tab>
        <Tab rounded="md">Customizations</Tab>
        <Tab rounded="md">Settings</Tab>
        <Tab rounded="md">External publish</Tab>
      </TabList>
      <TabPanels mx="auto" borderWidth="1px" rounded="lg" shadow="md" mt="2" p={[0, 4]}>
        {analyticsActive?.analytics?.widget_analytics === 1 && (
          <TabPanel>
            <ChannelAnalytics />
          </TabPanel>
        )}
        <TabPanel>
          <WidgetChannels />
        </TabPanel>
        <TabPanel>
          <Customizations />
        </TabPanel>
        <TabPanel>
          <Settings />
        </TabPanel>
        <TabPanel>
          <Publish />
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}

export default WidgetDetails
