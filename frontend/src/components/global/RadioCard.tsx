import { Box, Center, useColorMode, useColorModeValue, useRadio } from '@chakra-ui/react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function RadioCard(props: any) {
  const { getInputProps, getRadioProps } = useRadio(props)
  const formBackground = useColorModeValue('purple.500', 'purple.200')
  const iconColor = useColorModeValue('white', 'gray.800')
  const { colorMode } = useColorMode()

  const inputProps = getInputProps()
  const radioProps = getRadioProps()

  return (
    <Box as="label">
      <input {...inputProps} />
      <Center
        {...radioProps}
        _checked={{
          bg: props?.design !== 'border' && formBackground,
          borderColor: formBackground,
          borderWidth: '2px',
          color: iconColor
        }}
        _focus={{
          boxShadow: 'outline'
        }}
        borderRadius="md"
        borderWidth="1px"
        boxShadow="md"
        className={`radio-card ${colorMode}`}
        cursor="pointer"
        fontSize="xl"
        h="14"
        padding={1}
        w="14"
      >
        {props.children}
      </Center>
    </Box>
  )
}

export default RadioCard
