import { Link } from 'react-router-dom'
import { PhoneFrame } from '../components/PhoneFrame'
import './Home.css'

export function Home() {
  return (
    <PhoneFrame>
      <div className="phone__scroll home">
        <span className="kicker">FullTote · Build order A/B test</span>
        <h1 className="home__title">Two ways to build a market cart</h1>
        <p className="home__lede">
          Both options let you order from several Grand Lake Farmers Market vendors in one go.
          Try each and tell us which feels better.
        </p>

        <div className="home__cards">
          <Link to="/a" className="home__card">
            <span className="home__card-tag">Option A</span>
            <span className="home__card-name">Unified Grid</span>
            <span className="home__card-desc">
              One product grid across every vendor. Filter by category, tap to add.
            </span>
            <span className="home__card-go">Open Option A →</span>
          </Link>

          <Link to="/b" className="home__card">
            <span className="home__card-tag">Option B</span>
            <span className="home__card-name">Guided Builder</span>
            <span className="home__card-desc">
              A short step-by-step: pick categories, choose items, review your order.
            </span>
            <span className="home__card-go">Open Option B →</span>
          </Link>
        </div>

        <div className="home__tasks">
          <h2 className="home__tasks-title">Things to try in each option</h2>
          <ol>
            <li>Add items from at least two different vendors to one cart.</li>
            <li>Check everything that's in your cart, grouped by vendor, before placing the order.</li>
          </ol>
        </div>
      </div>
    </PhoneFrame>
  )
}
