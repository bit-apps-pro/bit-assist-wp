import CardColors from './common/CardColors'
import OpenWindowAction from './OpenWindowAction'
import usePostTypes from './data/usePostTypes'
import { Checkbox, CheckboxGroup, FormControl, FormHelperText, FormLabel, Spinner, Stack } from '@chakra-ui/react'
import { flowAtom } from '@globalStates/atoms'
import { useAtom } from 'jotai'

export default function WPSearch() {
  const { postTypes, isLoading } = usePostTypes()
  const [flow, setFlow] = useAtom(flowAtom)

  const handleChanges = (value: string[]) => {
    setFlow((prev) => {
      prev.config.wp_post_types = value
    })
  }

  return (
    <>
      <FormControl>
        <FormLabel>Select Post Types</FormLabel>
        <FormHelperText mb={4}>Select the post types you want to show in this channel.</FormHelperText>

        {isLoading && <Spinner />}

        <CheckboxGroup
          colorScheme="purple"
          onChange={handleChanges}
          defaultValue={['post', 'page']}
          value={flow.config?.wp_post_types}
        >
          <Stack spacing={[1, 5]} direction={['column', 'row']} wrap="wrap">
            {postTypes.map((postType) => (
              <Checkbox size="lg" key={postType.name} value={postType.name}>
                {postType.label}
              </Checkbox>
            ))}
          </Stack>
        </CheckboxGroup>
      </FormControl>

      <CardColors bg="#2271b1" color="#fff" />

      <OpenWindowAction />
    </>
  )
}
