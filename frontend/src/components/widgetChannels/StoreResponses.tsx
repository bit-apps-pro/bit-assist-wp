import { Box, Flex, FormControl, FormHelperText, FormLabel, Switch } from '@chakra-ui/react'
import { flowAtom } from '@globalStates/atoms'
import { __ } from '@wordpress/i18n'
import { useAtom } from 'jotai'

function StoreResponses() {
  const [flow, setFlow] = useAtom(flowAtom)

  const handleSwitchEnable = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setFlow(prev => {
      prev.config.store_responses = e.target.checked
    })
  }

  return (
    <Box>
      <FormControl>
        <Flex alignItems="center">
          <FormLabel mb="0">{__('Store Responses', 'bit-assist')}</FormLabel>
          <Switch
            colorScheme="purple"
            isChecked={!!flow.config.store_responses}
            ml="2"
            onChange={handleSwitchEnable}
          />
        </Flex>
        <FormHelperText>{__('Store form submit data in response list.', 'bit-assist')}</FormHelperText>
      </FormControl>
    </Box>
  )
}

export default StoreResponses
