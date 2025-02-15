import { Tab, TabList, TabPanel, TabPanels, Tabs, useColorModeValue } from '@chakra-ui/react'
import Customizations from '@components/customizations/Customizations'
import ChannelAnalytics from '@components/global/ChannelAnalytics'
import Publish from '@components/publish/Publish'
import Settings from '@components/settings/Settings'
import WidgetChannels from '@components/widgetChannels/WidgetChannels'
import config from '@config/config'
import { __ } from '@helpers/i18nwrap'
import useFetchIsAnalyticsActive from '@hooks/queries/analytics/useFetchIsAnalyticsActive'
import useFetchWidget from '@hooks/queries/widget/useFetchWidget'
import { useSearchParams } from 'react-router-dom'

function WidgetDetails() {
  useFetchWidget()
  const tabColorMode = useColorModeValue('rgba(255, 255, 255, 0.75)', 'rgba(26,32,44,0.75)')
  const { isAnalyticsActive } = useFetchIsAnalyticsActive()
  const [searchParams, setSearchParams] = useSearchParams()

  const tabIndex = Number(searchParams.get('tab')) || 0

  const handleTabChange = (tabIndex: number) => {
    setSearchParams(prev => {
      prev.set('tab', tabIndex.toString())
      return prev
    })
  }

  return (
    <Tabs colorScheme="purple" index={tabIndex} onChange={handleTabChange} variant="soft-rounded">
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
        <Tab rounded="md">{__('Channels')}</Tab>
        <Tab rounded="md">{__('Customizations')}</Tab>
        <Tab rounded="md">{__('Settings')}</Tab>
        {isAnalyticsActive === 1 && config.IS_PRO && <Tab rounded="md">{__('Analytics')}</Tab>}
        <Tab rounded="md">{__('External publish')}</Tab>
      </TabList>

      <TabPanels borderWidth="1px" mt="2" mx="auto" p={[0, 4]} rounded="lg" shadow="md">
        <TabPanel>
          <WidgetChannels />
        </TabPanel>
        <TabPanel>
          <Customizations />
        </TabPanel>
        <TabPanel>
          <Settings />
        </TabPanel>
        {isAnalyticsActive === 1 && config.IS_PRO && (
          <TabPanel>
            <ChannelAnalytics />
          </TabPanel>
        )}
        <TabPanel>
          <Publish />
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}

export default WidgetDetails
