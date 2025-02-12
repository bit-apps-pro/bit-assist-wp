import { useToast } from '@chakra-ui/react'

export default function useToaster() {
  const toast = useToast({
    containerStyle: {
      margin: '0.35rem'
    },
    isClosable: true,
    position: 'top-right'
  })

  const toaster = (
    status: 'error' | 'info' | 'loading' | 'success' | 'warning' | undefined,
    message: string
  ) => {
    let title = typeof message === 'string' ? message : 'Something went wrong'
    if (status === undefined) {
      title = 'Something went wrong'
    }

    toast({
      status: status ?? 'warning',
      title
    })
  }

  return toaster
}
