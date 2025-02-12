import { Grid, Input, Text, VStack } from '@chakra-ui/react'
import SingleChannel from '@components/widgetChannels/SingleChannel'
import { type Channel } from '@globalStates/Interfaces'
import { type ChangeEvent } from 'react'
import { useCallback, useMemo, useState } from 'react'

import channelList from './ChannelList'

const CUSTOM_CHANNEL_NAMES = new Set(['Custom-Channel', 'Custom-Iframe'])

function ChannelSelect() {
  const [filter, setFilter] = useState('')

  // Memoize the initial sorted channels
  const sortedChannels = useMemo(() => {
    const sorted = [...channelList].sort((a, b) => a.name.localeCompare(b.name))

    const { custom, other } = sorted.reduce<{ custom: Channel[]; other: Channel[] }>(
      (accumulator, channel) => {
        if (CUSTOM_CHANNEL_NAMES.has(channel.name)) {
          accumulator.custom.push(channel)
        } else {
          accumulator.other.push(channel)
        }
        return accumulator
      },
      { custom: [], other: [] }
    )

    return [...custom, ...other]
  }, [])

  // Memoize the filtered channels
  const filteredChannelList = useMemo(() => {
    if (!filter.trim()) return sortedChannels

    const normalizedFilter = filter.toLowerCase().trim()
    return sortedChannels.filter(channel => channel.name.toLowerCase().includes(normalizedFilter))
  }, [filter, sortedChannels])

  // Memoize the change handler
  const handleFilterChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value)
  }, [])

  return (
    <VStack spacing="4">
      <Input
        aria-label="Search channels"
        onChange={handleFilterChange}
        placeholder="Search"
        value={filter}
      />

      <Grid
        gap={[2, 3]}
        gridTemplateColumns="repeat(auto-fill, minmax(120px, 1fr))"
        justifyContent="center"
        w="full"
      >
        {filteredChannelList.map((channel: Channel) => (
          <SingleChannel channel={channel} key={channel.name} />
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
