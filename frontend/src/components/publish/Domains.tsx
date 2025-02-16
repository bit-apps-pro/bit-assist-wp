import { Box, Button, HStack, IconButton, Input, Kbd, Tooltip } from '@chakra-ui/react'
import Title from '@components/global/Title'
import Domain from '@components/publish/Domain'
import config from '@config/config'
import { widgetAtom } from '@globalStates/atoms'
import useUpdateWidgetPro from '@hooks/mutations/widget/useUpdateWidgetPro'
import useToaster from '@hooks/useToaster'
import { useAtom } from 'jotai'
import React, { useEffect, useRef, useState } from 'react'
import { HiCheck, HiOutlineTrash, HiPlus } from 'react-icons/hi'

function Domains() {
  const toaster = useToaster()
  const [widget, setWidget] = useAtom(widgetAtom)
  const { isWidgetUpdating, updateWidget } = useUpdateWidgetPro()
  const [isAdding, setIsAdding] = useState(false)
  const [domainName, setDomainName] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const tabIndex = config.IS_PRO ? 0 : -1

  const resetStates = () => {
    setDomainName('')
    setIsAdding(false)
  }

  const addNewDomain = async () => {
    try {
      const origin = new URL(domainName).origin.replace('www.', '')

      // const pattern = /\b((?=[a-z0-9-]{1,63}\.)(xn--)?[a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,63}\b/gm
      // pattern.test(origin) === false
      if (origin === '' || origin === 'null' || origin === null) {
        toaster('error', 'Please enter a valid domain name')
        return
      }

      if (window.location.host.replace('www.', '') === new URL(domainName).host.replace('www.', '')) {
        toaster('warning', 'You cannot add your own domain')
        return
      }

      const domains = Array.isArray(widget.domains) ? widget.domains : []

      const domainExists = domains.find((domain: string) => domain === origin)
      if (domainExists) {
        toaster('warning', 'Domain already exists')
        return
      }

      const { data, status } = await updateWidget({ ...widget, domains: [...domains, origin] })

      if (status === 'success') {
        setWidget(prev => {
          if (Array.isArray(prev.domains)) {
            prev.domains.push(origin)
          } else {
            prev.domains = [origin]
          }
        })
        resetStates()
      }

      toaster(status, data)
    } catch {
      toaster('error', 'Please enter a valid domain name')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.repeat) {
      return
    }

    if (e.key === 'Enter') {
      addNewDomain()
    } else if (e.key === 'Escape') {
      resetStates()
    }
  }

  useEffect(() => {
    if (isAdding) {
      inputRef.current?.focus()
    }
  }, [isAdding])

  return (
    <Box>
      <Title badge="1">Add Bit Assist to your other website</Title>
      <Box maxW="full" w="sm">
        <Box borderWidth={`${widget.domains?.length && '1px'}`} mb="4" rounded="md">
          {widget.domains?.map((domain, index) => (
            <Domain
              domain={domain}
              index={index}
              isWidgetUpdating={isWidgetUpdating}
              key={domain}
              updateWidget={updateWidget}
            />
          ))}
        </Box>

        {isAdding && (
          <Box mb={4}>
            <HStack mb={2}>
              <Input
                onChange={e => setDomainName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="ex: https://your-domain.com"
                ref={inputRef}
                tabIndex={tabIndex}
                value={domainName ?? ''}
              />
              <Tooltip label="Cancel">
                <IconButton
                  aria-label="Remove Domain"
                  colorScheme="red"
                  icon={<HiOutlineTrash />}
                  isRound
                  onClick={resetStates}
                  tabIndex={tabIndex}
                  variant="ghost"
                />
              </Tooltip>
              <Tooltip label="Save">
                <IconButton
                  aria-label="Remove Domain"
                  colorScheme="green"
                  disabled={isWidgetUpdating}
                  icon={<HiCheck />}
                  isRound
                  onClick={() => addNewDomain()}
                  tabIndex={tabIndex}
                  variant="ghost"
                />
              </Tooltip>
            </HStack>
            <span>
              Press <Kbd>enter</Kbd> to add, &nbsp; <Kbd>esc</Kbd> to cancel
            </span>
          </Box>
        )}

        {!isAdding && (
          <Button
            colorScheme="gray"
            isLoading={isWidgetUpdating}
            leftIcon={<HiPlus />}
            onClick={() => setIsAdding(true)}
            tabIndex={tabIndex}
            variant="outline"
          >
            Add Domain
          </Button>
        )}
      </Box>
    </Box>
  )
}

export default Domains
