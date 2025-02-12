import space from '@resource/img/space.svg'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Error404() {
  const [sec, setsec] = useState(9)
  const navigate = useNavigate()

  useEffect(() => {
    setTimeout(() => {
      if (sec === 0) {
        navigate('/', { replace: true })
      }
      setsec(sec - 1)
    }, 1000)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sec])

  return (
    <div className="error-404">
      <div>
        <div className="four">404</div>
        <div className="t">Lost In Space</div>
        <br />
        Redirecting Home in {sec}
        <br />
        <br />
        <Link className="btn dp-blue btcd-btn-lg" to="/">
          Go Home
        </Link>
      </div>
      <img alt="404 not found" src={space} />
    </div>
  )
}
