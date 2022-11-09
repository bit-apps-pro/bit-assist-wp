import { Box, Flex, FormControl, FormHelperText, FormLabel, Switch } from '@chakra-ui/react'
import { flowAtom } from '@globalStates/atoms'
import { useAtom } from 'jotai'

function StoreResponses() {
  const [flow, setFlow] = useAtom(flowAtom)

  const handleSwitchEnable = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setFlow((prev) => {
      prev.config.store_responses = e.target.checked
    })
  }

  return (
    <Box>
      <FormControl>
        <Flex alignItems="center">
          <FormLabel mb="0">Store Responses</FormLabel>
          <Switch ml="2" isChecked={!!flow.config.store_responses} colorScheme="purple" onChange={handleSwitchEnable} />
        </Flex>
        <FormHelperText>Store form submit data in response list.</FormHelperText>
      </FormControl>
    </Box>
  )
}

export default StoreResponses
