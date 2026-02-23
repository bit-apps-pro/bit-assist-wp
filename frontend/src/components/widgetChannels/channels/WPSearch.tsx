/* eslint-disable unicorn/filename-case */
import {
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormHelperText,
  FormLabel,
  Spinner,
  Stack
} from '@chakra-ui/react'
import { flowAtom } from '@globalStates/atoms'
import { __ } from '@helpers/i18nwrap'
import { useAtom } from 'jotai'

import CardColors from './common/CardColors'
import usePostTypes from './data/usePostTypes'
import OpenWindowAction from './OpenWindowAction'

export default function WPSearch() {
  const { isLoading, postTypes } = usePostTypes()
  const [flow, setFlow] = useAtom(flowAtom)

  const handleChanges = (value: string[]) => {
    setFlow(prev => {
      prev.config.wp_post_types = value
    })
  }

  return (
    <>
      <FormControl>
        <FormLabel>{__('Select Post Types')}</FormLabel>
        <FormHelperText mb={4}>
          {__('Select the post types you want to show in this channel.')}
        </FormHelperText>

        {isLoading && <Spinner />}

        <CheckboxGroup
          colorScheme="purple"
          defaultValue={['post', 'page']}
          onChange={handleChanges}
          value={flow.config?.wp_post_types}
        >
          <Stack direction={['column', 'row']} spacing={[1, 5]} wrap="wrap">
            {postTypes.map(postType => (
              <Checkbox key={postType.name} size="lg" value={postType.name}>
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
