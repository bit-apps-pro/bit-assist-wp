import {
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputRightAddon,
  Radio,
  RadioGroup,
  Stack,
  Switch,
  Text
} from '@chakra-ui/react'
import { flowAtom } from '@globalStates/atoms'
import { __ } from '@wordpress/i18n'
import { produce } from 'immer'
import { useAtom } from 'jotai'
import { useEffect } from 'react'

export default function CustomIframe() {
  const [flow, setFlow] = useAtom(flowAtom)

  useEffect(() => {
    if (!flow?.config?.iframe_options) {
      setFlow(
        produce(draft => {
          draft.config.iframe_options = {
            aspect_ratio: '3/2',
            height: '360',
            scrollbar: false,
            width: '540'
          }
        })
      )
    }
  }, [])

  const handleChanges = (value: string) => {
    setFlow(
      produce(draft => {
        draft.config.unique_id = value
        draft.config.url = value
      })
    )
  }

  const handleHeightWidth = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? Number(e.target.value) : 0
    if (Number.isNaN(value)) {
      return
    }
    const { name } = e.target
    setFlow(
      produce(draft => {
        draft.config.iframe_options[name] = value
      })
    )
  }

  const handelCustom = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setFlow(
      produce(draft => {
        draft.config.iframe_options.aspect_ratio = value
      })
    )
  }

  const handleSwitchEnable = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFlow(draft => {
      if (draft.config.iframe_options !== undefined) {
        draft.config.iframe_options.scrollbar = e.target.checked
      }
    })
  }

  return (
    <>
      <FormControl>
        <FormLabel>{__('iFrame url', 'bit-assist')}</FormLabel>
        <Input
          onChange={e => handleChanges(e.target.value)}
          placeholder="https://..."
          required
          value={flow.config?.unique_id || ''}
        />
        <FormHelperText>
          {__('Do not use iFrame tag directly, use URL from iFrame only.', 'bit-assist')}
        </FormHelperText>
      </FormControl>

      <FormControl>
        <FormLabel>{__('Aspect Ratio', 'bit-assist')}</FormLabel>
        <RadioGroup
          colorScheme="purple"
          defaultValue="3/2"
          my="6"
          value={flow?.config?.iframe_options?.aspect_ratio}
        >
          <Stack direction={['column', 'row']} spacing={[1, 5]} wrap="wrap">
            <Radio onChange={e => handelCustom(e)} value="custom">
              {__('Custom', 'bit-assist')}
            </Radio>
            <Radio onChange={e => handelCustom(e)} value="1/1">
              1:1
            </Radio>
            <Radio onChange={e => handelCustom(e)} value="3/2">
              3:2
            </Radio>
            <Radio onChange={e => handelCustom(e)} value="4/3">
              4:3
            </Radio>
            <Radio onChange={e => handelCustom(e)} value="16/9">
              16:9
            </Radio>
          </Stack>
        </RadioGroup>

        <Stack mt="2">
          <InputGroup>
            <Text fontSize={'14'} fontWeight={'normal'} w="20">
              {__('Width', 'bit-assist')}
            </Text>
            <Input
              min="0"
              name="width"
              onChange={e => handleHeightWidth(e)}
              placeholder="540"
              required
              value={flow?.config?.iframe_options?.width || ''}
              w="28"
            />
            <InputRightAddon>{__('px', 'bit-assist')}</InputRightAddon>
          </InputGroup>
          {flow?.config?.iframe_options?.aspect_ratio === 'custom' && (
            <>
              <InputGroup>
                <Text fontSize={'14'} fontWeight={'normal'} w="20">
                  {__('Height', 'bit-assist')}
                </Text>
                <Input
                  min="0"
                  name="height"
                  onChange={e => handleHeightWidth(e)}
                  placeholder="360"
                  required
                  value={flow?.config?.iframe_options?.height || ''}
                  w="28"
                />
                <InputRightAddon>{__('px', 'bit-assist')}</InputRightAddon>
              </InputGroup>
            </>
          )}

          <HStack>
            <Text fontSize={'md'} fontWeight={'medium'} mr={3} whiteSpace="nowrap">
              {__('iFrame Scrollbar', 'bit-assist')}
            </Text>
            <Switch
              colorScheme="purple"
              isChecked={!!flow?.config?.iframe_options?.scrollbar}
              onChange={handleSwitchEnable}
            />
          </HStack>
        </Stack>
      </FormControl>
    </>
  )
}
