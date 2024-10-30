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
  Text,
  Stack,
  Switch,
} from '@chakra-ui/react'
import { flowAtom } from '@globalStates/atoms'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { produce } from 'immer'

export default function CustomIframe() {
  const [flow, setFlow] = useAtom(flowAtom)

  useEffect(() => {
    if (!flow?.config?.iframe_options) {
      setFlow(
        produce((draft) => {
          draft.config.iframe_options = {
            aspect_ratio: '3/2',
            width: '540',
            height: '360',
            scrollbar: false,
          }
        }),
      )
    }
  }, [])

  const handleChanges = (value: string) => {
    setFlow(
      produce((draft) => {
        draft.config.unique_id = value
        draft.config.url = value
      }),
    )
  }

  const handleHeightWidth = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? Number(e.target.value) : 0
    if (isNaN(value)) {
      return
    }
    const { name } = e.target
    setFlow(
      produce((draft) => {
        draft.config.iframe_options[name] = value
      }),
    )
  }

  const handelCustom = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setFlow(
      produce((draft) => {
        draft.config.iframe_options.aspect_ratio = value
      }),
    )
  }

  const handleSwitchEnable = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFlow((draft) => {
      if (draft.config.iframe_options !== undefined) {
        draft.config.iframe_options.scrollbar = e.target.checked
      }
    })
  }

  return (
    <>
      <FormControl>
        <FormLabel>iFrame url</FormLabel>
        <Input
          value={flow.config?.unique_id || ''}
          onChange={(e) => handleChanges(e.target.value)}
          placeholder="https://..."
          required
        />
        <FormHelperText>
          Do not use iFrame tag directly, use <b>URL</b> from iFrame only.
        </FormHelperText>
      </FormControl>

      <FormControl>
        <FormLabel>Aspect Ratio</FormLabel>
        <RadioGroup colorScheme="purple" my="6" value={flow?.config?.iframe_options?.aspect_ratio} defaultValue="3/2">
          <Stack spacing={[1, 5]} direction={['column', 'row']} wrap="wrap">
            <Radio value="custom" onChange={(e) => handelCustom(e)}>
              Custom
            </Radio>
            <Radio value="1/1" onChange={(e) => handelCustom(e)}>
              1:1
            </Radio>
            <Radio value="3/2" onChange={(e) => handelCustom(e)}>
              3:2
            </Radio>
            <Radio value="4/3" onChange={(e) => handelCustom(e)}>
              4:3
            </Radio>
            <Radio value="16/9" onChange={(e) => handelCustom(e)}>
              16:9
            </Radio>
          </Stack>
        </RadioGroup>

        <Stack mt="2">
          <InputGroup>
            <Text w="20" fontWeight={'normal'} fontSize={'14'}>
              Width
            </Text>
            <Input
              name="width"
              min="0"
              w="28"
              value={flow?.config?.iframe_options?.width || ''}
              onChange={(e) => handleHeightWidth(e)}
              placeholder="540"
              required
            />
            <InputRightAddon children="px" />
          </InputGroup>
          {flow?.config?.iframe_options?.aspect_ratio === 'custom' && (
            <>
              <InputGroup>
                <Text w="20" fontWeight={'normal'} fontSize={'14'}>
                  Height
                </Text>
                <Input
                  name="height"
                  min="0"
                  w="28"
                  value={flow?.config?.iframe_options?.height || ''}
                  onChange={(e) => handleHeightWidth(e)}
                  placeholder="360"
                  required
                />
                <InputRightAddon children="px" />
              </InputGroup>
            </>
          )}

          <HStack>
            <Text mr={3} fontWeight={'medium'} fontSize={'md'} whiteSpace="nowrap">
              iFrame Scrollbar
            </Text>
            <Switch
              isChecked={!!flow?.config?.iframe_options?.scrollbar}
              colorScheme="purple"
              onChange={handleSwitchEnable}
            />
          </HStack>
        </Stack>
      </FormControl>
    </>
  )
}
