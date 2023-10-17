import { VStack, Input, Text, Grid } from '@chakra-ui/react'
import SingleChannel from '@components/widgetChannels/SingleChannel'
import { Channel } from '@globalStates/Interfaces'
import { useState } from 'react'
import channelList from './ChannelList'

function ChannelSelect() {
  const [filter, setFilter] = useState<string>('')

  const filterChannels = (channel: Channel, filter: string): boolean => {
    const words = filter.toLowerCase().split(' ')
    return words.every((word) => channel.name.toLowerCase().includes(word))
  }

  const filteredChannelList = channelList?.filter((channel: Channel) => filterChannels(channel, filter))

  return (
    <VStack spacing="4">
      <Input value={filter} placeholder="Search" onChange={(e) => setFilter(e.target.value)} />

      <Grid justifyContent="center" gap={[2, 3]} w="full" gridTemplateColumns="repeat(auto-fill, minmax(120px, 1fr))">
        {filteredChannelList?.map((channel: Channel) => (
          <SingleChannel key={channel.name} channel={channel} />
        ))}
      </Grid>

      {filteredChannelList?.length === 0 && (
        <Text color="gray.500" fontSize="md">
          No item found.
        </Text>
      )}
    </VStack>
  )
}

export default ChannelSelect
