/* eslint-disable react/no-children-prop */
import {
  Box,
  Button,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftAddon,
  Kbd,
  Select,
  Tooltip
} from '@chakra-ui/react'
import ProWrapper from '@components/global/ProWrapper'
import Title from '@components/global/Title'
import Page from '@components/settings/Page'
import config from '@config/config'
import { widgetAtom } from '@globalStates/atoms'
import useUpdateWidgetPro from '@hooks/mutations/widget/useUpdateWidgetPro'
import useToaster from '@hooks/useToaster'
import { produce } from 'immer'
import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { HiCheck, HiOutlineTrash, HiPlus } from 'react-icons/hi'

function PageFilters() {
  const toaster = useToaster()
  const [widget, setWidget] = useAtom(widgetAtom)
  const { isWidgetUpdating, updateWidget } = useUpdateWidgetPro()
  const [isAdding, setIsAdding] = useState(false)
  const [pageDomain, setPageDomain] = useState('')
  const [pageUrl, setPageName] = useState('')
  const [pageVisibility, setPageVisibility] = useState('')
  const [pageCondition, setPageCondition] = useState('')
  const tabIndex = config.IS_PRO ? 0 : -1

  const resetStates = () => {
    setIsAdding(false)
    setPageName('')
    setPageCondition('')
    setPageVisibility('')
  }

  const addNewPage = async () => {
    if (pageVisibility === '' || pageCondition === '' || (pageUrl === '' && pageCondition !== 'equal')) {
      toaster('warning', 'All fields are required')
      return
    }

    const newPage = { condition: pageCondition, url: pageUrl, visibility: pageVisibility }

    setWidget(prev => {
      if (!Array.isArray(prev.exclude_pages)) {
        prev.exclude_pages = []
      }
      prev.exclude_pages.push(newPage)
    })
    resetStates()

    const { data, status } = await updateWidget(
      produce(widget, draft => {
        if (!Array.isArray(draft.exclude_pages)) {
          draft.exclude_pages = []
        }
        draft.exclude_pages.push(newPage)
      })
    )
    toaster(status, data)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.repeat) {
      return
    }

    if (e.key === 'Enter') {
      addNewPage()
    } else if (e.key === 'Escape') {
      resetStates()
    }
  }

  useEffect(() => {
    setPageDomain(window.location.origin)
  }, [])

  const addPageButtonClickHandle = () => {
    setIsAdding(true)
    setPageVisibility('showOn')
    setPageCondition('contains')
  }

  return (
    <Box>
      <Title>Page Filters</Title>

      <Box mt={4}>
        <Box borderWidth={`${widget.exclude_pages?.length && '1px'}`} mb="4" rounded="md">
          {widget.exclude_pages?.map((page, index) => (
            <Page
              index={index}
              isWidgetUpdating={isWidgetUpdating}
              key={page?.url}
              page={page}
              pageDomain={pageDomain}
              updateWidget={updateWidget}
            />
          ))}
        </Box>
      </Box>

      {isAdding && (
        <ProWrapper>
          <Box>
            <HStack gap="2" mb={2} overflow="auto" pr="2" py="2" spacing="0">
              <Select
                maxW="full"
                minW="7rem"
                onChange={e => setPageVisibility(e.target.value)}
                tabIndex={tabIndex}
                w="15rem"
              >
                <option value="showOn">Show On</option>
                <option value="hideOn">Hide On</option>
              </Select>
              <Select
                maxW="full"
                minW="10rem"
                onChange={e => setPageCondition(e.target.value)}
                tabIndex={tabIndex}
                w="25rem"
              >
                <option value="contains">Pages that contain</option>
                <option value="equal">Specific page</option>
                <option value="startWith">Pages stars with</option>
                <option value="endWith">Pages ended with</option>
              </Select>
              <InputGroup>
                <InputLeftAddon children="your-domain/" />
                <Input
                  minW="10rem"
                  onChange={e => setPageName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Page slug"
                  tabIndex={tabIndex}
                  value={pageUrl ?? ''}
                />
              </InputGroup>

              <Tooltip label="Cancel">
                <IconButton
                  aria-label="Remove Page"
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
                  aria-label="Remove Page"
                  colorScheme="green"
                  disabled={isWidgetUpdating}
                  icon={<HiCheck />}
                  isRound
                  mr={2}
                  onClick={() => addNewPage()}
                  tabIndex={tabIndex}
                  variant="ghost"
                />
              </Tooltip>
            </HStack>
            <span>
              Press <Kbd>enter</Kbd> to add, &nbsp; <Kbd>esc</Kbd> to cancel
            </span>
          </Box>
        </ProWrapper>
      )}

      {isAdding ? undefined : (
        <Button
          colorScheme="gray"
          isLoading={isWidgetUpdating}
          leftIcon={<HiPlus />}
          onClick={addPageButtonClickHandle}
          variant="outline"
        >
          Add Page
        </Button>
      )}

      {!config.IS_PRO && isAdding ? (
        <Button colorScheme="red" mt="4" onClick={resetStates} variant="outline">
          Remove Filter
        </Button>
      ) : undefined}
    </Box>
  )
}

export default PageFilters
