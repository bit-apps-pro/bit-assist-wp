import { Box, Container } from '@chakra-ui/react'
import Navbar from '@components/global/Navbar'
import { ReactQueryDevtools } from 'react-query/devtools'
import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <Box>
      <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      <Navbar />
      <Container maxW="1170px" pb={6} px={[4, 6]}>
        <main>
          <Outlet />
        </main>
      </Container>
    </Box>
  )
}
