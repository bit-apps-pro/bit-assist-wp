import { useToast } from '@chakra-ui/react'

export default function useToaster() {
  const toast = useToast({
    position: 'top-right',
    isClosable: true,
    containerStyle: {
      margin: '0.35rem',
    },
  })

  const toaster = (status: 'info' | 'warning' | 'success' | 'error' | 'loading' | undefined, message: string) => {
    let title = typeof message === 'string' ? message : 'Something went wrong'
    if (typeof status === 'undefined') {
      title = 'Something went wrong'
    }

    toast({
      status: status ?? 'warning',
      title,
    })
  }

  return toaster
}
