import { useToast } from '@chakra-ui/react'

export default function useToaster() {
  const toast = useToast({ isClosable: true })

  const toaster = (status: 'info' | 'warning' | 'success' | 'error' | 'loading' | undefined, message: string) => {
    let title = message
    if (typeof status === 'undefined' || status === 'error') {
      title = 'Something went wrong'
    }

    toast({
      status: status ?? 'warning',
      title,
      position: 'top-right',
    })
  }

  return toaster
}
