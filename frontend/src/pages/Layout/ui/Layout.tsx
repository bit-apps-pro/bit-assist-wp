import { Box, Container } from '@chakra-ui/react'
import { ReactQueryDevtools } from 'react-query/devtools'
import { Outlet } from 'react-router-dom'
import Navbar from '@components/global/Navbar'

export default function Layout() {
  return (
    <Box>
      <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      <Navbar />
      <Container maxW="container.lg" pb={4}>
        <main>
          <Outlet />
        </main>
      </Container>
    </Box>
  )
}
