import { VStack, Input, Spinner, Text, Grid } from '@chakra-ui/react'
import useFetchChannels from '@hooks/queries/channel/useFetchChannels'
import SingleChannel from '@components/widgetChannels/SingleChannel'
import { Channel } from '@globalStates/Interfaces'
import { useState } from 'react'

const ChannelSelect = () => {
  const [filter, setFilter] = useState('')
  const { channels, isChannelsFetching } = useFetchChannels()
  const [filteredChannels, setFilteredChannels] = useState<Channel[]>([])

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value)
    setFilteredChannels(channels?.filter((channel: Channel) => channel.name.toLowerCase().includes(e.target.value.toLowerCase())))
  }

  return (
    <VStack spacing="4">
      <Input value={filter} placeholder="Search channels" onChange={handleFilterChange} />

      <Grid justifyContent="center" gap={[2, 3]} w="full" gridTemplateColumns="repeat(auto-fill, minmax(120px, 1fr))">
        {filter.length
          ? filteredChannels?.map((channel: Channel) => <SingleChannel key={channel.id} channel={channel} />)
          : channels?.map((channel: Channel) => <SingleChannel key={channel.id} channel={channel} />)}
      </Grid>

      {isChannelsFetching && <Spinner />}
      {!isChannelsFetching && (channels?.length === 0 || (filter.length && filteredChannels?.length === 0)) && (
        <Text color="gray.500" fontSize="md">
          No channels found
        </Text>
      )}
    </VStack>
  )
}

export default ChannelSelect
