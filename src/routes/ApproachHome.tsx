import { Link } from 'react-router-dom'
import { PhoneFrame } from '../components/PhoneFrame'
import './ApproachHome.css'

interface ApproachHomeProps {
  name: string
  tagline: string
  /** where the "Start" button goes — the first screen of this option's flow */
  startTo: string
  startLabel: string
}

/**
 * Standalone entry screen for a single option. Each approach has its own,
 * with no link to the other — a test participant only ever sees one variant.
 */
export function ApproachHome({ name, tagline, startTo, startLabel }: ApproachHomeProps) {
  return (
    <PhoneFrame>
      <div className="phone__scroll ahome">
        <span className="kicker">FullTote · Build order</span>
        <h1 className="ahome__title">{name}</h1>
        <p className="ahome__tagline">{tagline}</p>

        <div className="ahome__tasks">
          <h2 className="ahome__tasks-title">What to try</h2>
          <ol>
            <li>Add items from at least two different vendors to one cart.</li>
            <li>Check everything in your cart, grouped by vendor, before placing the order.</li>
          </ol>
        </div>

        <Link to={startTo} className="btn btn--primary btn--block ahome__start">
          {startLabel}
        </Link>
      </div>
    </PhoneFrame>
  )
}
