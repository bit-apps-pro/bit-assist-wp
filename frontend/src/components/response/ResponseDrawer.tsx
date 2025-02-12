import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Text
} from '@chakra-ui/react'
import { type ResponseFileType, type WidgetResponse } from '@globalStates/Interfaces'
import { type MutableRefObject } from 'react'

import DownloadLinks from './DownloadLinks'

interface ResponseDrawerProps {
  btnRef: MutableRefObject<HTMLButtonElement | null>
  drawerResponse: undefined | WidgetResponse
  handleDrawerClose: () => void
  isDrawerOpen: boolean
}

export default function ResponseDrawer({
  btnRef,
  drawerResponse,
  handleDrawerClose,
  isDrawerOpen
}: ResponseDrawerProps) {
  return (
    <Drawer finalFocusRef={btnRef} isOpen={isDrawerOpen} onClose={handleDrawerClose} placement="right">
      <DrawerOverlay bg="blackAlpha.400" />
      <DrawerContent marginTop="32px">
        <DrawerCloseButton />
        <DrawerHeader>Response Details</DrawerHeader>

        <DrawerBody>
          {drawerResponse &&
            Object.entries<ResponseFileType[] | string>(drawerResponse.response).map(
              ([label, value]) => (
                <Box key={label + Math.random()}>
                  <Text fontSize="md" fontWeight="bold" mb="2">
                    {label.toUpperCase().replaceAll('_', ' ')}
                  </Text>

                  {typeof value === 'object' ? (
                    <HStack flexWrap="wrap" gap="1" maxW="300px" mb="2" spacing="0">
                      <DownloadLinks files={value} widgetChannelId={drawerResponse.widget_channel_id} />
                    </HStack>
                  ) : (
                    <Text fontSize="sm" mb="2">
                      {value}
                    </Text>
                  )}
                </Box>
              )
            )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}
