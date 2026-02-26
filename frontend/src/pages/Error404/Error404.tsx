import space from '@resource/img/space.svg'
import { __ } from '@wordpress/i18n'
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
        <div className="t">{__('Lost In Space', 'bit-assist')}</div>
        <br />
        {__('Redirecting Home in', 'bit-assist')} {sec}
        <br />
        <br />
        <Link className="btn dp-blue btcd-btn-lg" to="/">
          {__('Go Home', 'bit-assist')}
        </Link>
      </div>
      <img alt={__('404 not found', 'bit-assist')} src={space} />
    </div>
  )
}
