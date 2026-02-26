import { Link, Text } from '@chakra-ui/react'
import { flowAtom } from '@globalStates/atoms'
import { __, sprintf } from '@wordpress/i18n'
import { useAtom } from 'jotai'
import { useEffect } from 'react'

function Tawk() {
  const [, setFlow] = useAtom(flowAtom)

  useEffect(() => {
    setFlow(prev => {
      if (prev.config?.card_config === undefined) {
        prev.config.card_config = {}
      }
      prev.config.card_config.isChatWidget = true
    })
  }, [])

  return (
    <Text>
      {sprintf(
        // translators: %s: Service name (e.g. Crisp, Intercom)
        __('Make Sure to add the %s script to your website.', 'bit-assist'),
        __('Tawk.to', 'bit-assist')
      )}{' '}
      <Link href="https://www.tawk.to/" isExternal textDecoration="underline">
        {__('Learn more', 'bit-assist')}
      </Link>
    </Text>
  )
}

export default Tawk
