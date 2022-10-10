import { Box, FormControl, FormHelperText, FormLabel, Switch } from '@chakra-ui/react'
import { flowAtom } from '@globalStates/atoms'
import { useAtom } from 'jotai'

const StoreResponses = () => {
  const [flow, setFlow] = useAtom(flowAtom)

  const handleSwitchEnable = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setFlow((prev) => {
      prev.config.store_responses = e.target.checked
    })
  }

  return (
    <Box>
      <FormControl>
        <FormLabel htmlFor="storeResponses" display="flex" alignItems="center">
          Store Responses
          <Switch ml="2" isChecked={!!flow.config.store_responses} colorScheme={'purple'} onChange={handleSwitchEnable} id="storeResponses" />
        </FormLabel>
        <FormHelperText>Store form submit data in response list.</FormHelperText>
      </FormControl>
    </Box>
  )
}

export default StoreResponses
