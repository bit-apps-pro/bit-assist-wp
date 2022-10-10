import '../resource/styles/variables.css'
import '../resource/styles/utilities.sass'
import '../resource/styles/global.css'
// import 'https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;500;600&display=swap'
import { RecoilRoot, useRecoilState } from 'recoil'
import { $appConfig } from '@common/globalStates'
import { useEffect } from 'react'

function Wrapper({ children }: { children: React.ReactNode }) {
  const [appConfig, setAppConfig] = useRecoilState($appConfig)
  const { isDarkTheme } = appConfig

  useEffect(() => {
    const link = document.createElement('link')
    fetch('https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;500;600&display=swap')
      .then(response => response.text())
      .then(data => {
        link.type = 'text/css'
        link.rel = 'stylesheet'
        link.href = `data:text/css;charset=utf-8,${encodeURIComponent(data)}`
        document.head.appendChild(link)
      })
  }, [])

  return (
    <div>
      <button type="button" onClick={() => setAppConfig(prv => ({ ...prv, isDarkTheme: !prv.isDarkTheme }))}>Toggle Dark</button>
      <div
        color-scheme={isDarkTheme ? 'dark' : 'light'}
        style={{
          margin: 50,
          minHeight: '20vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg)',
        }}
      >
        {children}
      </div>
    </div>
  )
}

export default function StoriesWrapper({ children }: { children: React.ReactNode }) {
  return (
    <RecoilRoot>
      <Wrapper>{children}</Wrapper>
    </RecoilRoot>
  )
}
