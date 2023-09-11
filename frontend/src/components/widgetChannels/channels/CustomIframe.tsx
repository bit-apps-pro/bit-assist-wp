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
} from '@chakra-ui/react'
import { flowAtom } from '@globalStates/atoms'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { produce } from 'immer'

export default function CustomIframe() {
  const [flow, setFlow] = useAtom(flowAtom)

  useEffect(() => {
    if (!flow?.config?.iframe_size) {
      setFlow(
        produce((draft) => {
          draft.config.iframe_size = {
            aspect_ratio: '3/2',
            width: '540',
            height: '360',
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
        draft.config.iframe_size[name] = value
      }),
    )
  }

  const handelCustom = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setFlow(
      produce((draft) => {
        draft.config.iframe_size.aspect_ratio = value
      }),
    )
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
        <RadioGroup my="6" value={flow?.config?.iframe_size?.aspect_ratio} defaultValue="3/2">
          <HStack spacing={4}>
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
          </HStack>
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
              value={flow?.config?.iframe_size?.width || ''}
              onChange={(e) => handleHeightWidth(e)}
              placeholder="540"
              required
            />
            <InputRightAddon children="px" />
          </InputGroup>
          {flow?.config?.iframe_size?.aspect_ratio === 'custom' && (
            <>
              <InputGroup>
                <Text w="20" fontWeight={'normal'} fontSize={'14'}>
                  Height
                </Text>
                <Input
                  name="height"
                  min="0"
                  w="28"
                  value={flow?.config?.iframe_size?.height || ''}
                  onChange={(e) => handleHeightWidth(e)}
                  placeholder="360"
                  required
                />
                <InputRightAddon children="px" />
              </InputGroup>
            </>
          )}
        </Stack>
      </FormControl>
    </>
  )
}
