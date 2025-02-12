import { Tab, TabList, TabPanel, TabPanels, Tabs, useColorModeValue } from '@chakra-ui/react'
import Customizations from '@components/customizations/Customizations'
import ChannelAnalytics from '@components/global/ChannelAnalytics'
import Publish from '@components/publish/Publish'
import Settings from '@components/settings/Settings'
import WidgetChannels from '@components/widgetChannels/WidgetChannels'
import config from '@config/config'
import useFetchIsAnalyticsActive from '@hooks/queries/analytics/useFetchIsAnalyticsActive'
import useFetchWidget from '@hooks/queries/widget/useFetchWidget'

function WidgetDetails() {
  useFetchWidget()
  const tabColorMode = useColorModeValue('rgba(255, 255, 255, 0.75)', 'rgba(26,32,44,0.75)')
  const { isAnalyticsActive } = useFetchIsAnalyticsActive()

  return (
    <Tabs colorScheme="purple" variant="solid-rounded">
      <TabList
        backdropFilter="blur(10px)"
        bg={tabColorMode}
        flexWrap="wrap"
        gap={['1', '2']}
        justifyContent="center"
        position="sticky"
        py="2"
        top="32px"
        zIndex={2}
      >
        {isAnalyticsActive === 1 && config.IS_PRO && <Tab rounded="md">Analytics</Tab>}
        <Tab rounded="md">Channels</Tab>
        <Tab rounded="md">Customizations</Tab>
        <Tab rounded="md">Settings</Tab>
        <Tab rounded="md">External publish</Tab>
      </TabList>
      <TabPanels borderWidth="1px" mt="2" mx="auto" p={[0, 4]} rounded="lg" shadow="md">
        {isAnalyticsActive === 1 && config.IS_PRO && (
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
