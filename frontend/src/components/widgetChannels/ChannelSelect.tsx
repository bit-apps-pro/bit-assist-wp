import { VStack, Input, Text, Grid } from '@chakra-ui/react'
import SingleChannel from '@components/widgetChannels/SingleChannel'
import { Channel } from '@globalStates/Interfaces'
import { useMemo, useState, useCallback, ChangeEvent } from 'react'
import channelList from './ChannelList'

const CUSTOM_CHANNEL_NAMES = ['Custom-Channel', 'Custom-Iframe']

function ChannelSelect() {
  const [filter, setFilter] = useState('')

  // Memoize the initial sorted channels
  const sortedChannels = useMemo(() => {
    const sorted = [...channelList].sort((a, b) => a.name.localeCompare(b.name))

    const { custom, other } = sorted.reduce<{ custom: Channel[]; other: Channel[] }>(
      (acc, channel) => {
        if (CUSTOM_CHANNEL_NAMES.includes(channel.name)) {
          acc.custom.push(channel)
        } else {
          acc.other.push(channel)
        }
        return acc
      },
      { custom: [], other: [] },
    )

    return [...custom, ...other]
  }, [])

  // Memoize the filtered channels
  const filteredChannelList = useMemo(() => {
    if (!filter.trim()) return sortedChannels

    const normalizedFilter = filter.toLowerCase().trim()
    return sortedChannels.filter((channel) => channel.name.toLowerCase().includes(normalizedFilter))
  }, [filter, sortedChannels])

  // Memoize the change handler
  const handleFilterChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value)
  }, [])

  return (
    <VStack spacing="4">
      <Input value={filter} placeholder="Search" onChange={handleFilterChange} aria-label="Search channels" />

      <Grid justifyContent="center" gap={[2, 3]} w="full" gridTemplateColumns="repeat(auto-fill, minmax(120px, 1fr))">
        {filteredChannelList.map((channel: Channel) => (
          <SingleChannel key={channel.name} channel={channel} />
        ))}
      </Grid>

      {filteredChannelList.length === 0 && (
        <Text color="gray.500" fontSize="md">
          No item found.
        </Text>
      )}
    </VStack>
  )
}

export default ChannelSelect
