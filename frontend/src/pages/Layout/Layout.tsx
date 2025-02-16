import { Box, Container } from '@chakra-ui/react'
import Loading from '@components/global/Loading'
import Navbar from '@components/global/Navbar'
import { Suspense } from 'react'
import { ReactQueryDevtools } from 'react-query/devtools'
import { Outlet, useLocation } from 'react-router-dom'

export default function Layout() {
  const { key } = useLocation()

  return (
    <Box>
      <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      <Navbar />
      <Container maxW="1170px" pb={6} px={[4, 6]}>
        <main>
          <Suspense fallback={<Loading />} key={key}>
            <Outlet />
          </Suspense>
        </main>
      </Container>
    </Box>
  )
}
