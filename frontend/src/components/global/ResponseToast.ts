interface Props {
  toast
  response: any
  action: 'create' | 'update' | 'delete'
  messageFor: string
}

const ResponseToast = ({ toast, response, action, messageFor }: Props) => {
  if (response === undefined) {
    return
  }

  let title = `${messageFor} ${action}d`
  if (response?.status === 'error') {
    title = `${messageFor} could not be ${action}d`
  }

  toast({
    status: response?.status,
    position: 'top-right',
    title,
  })
}

export default ResponseToast
