import { Link } from 'react-router-dom'

interface AppHeaderProps {
  title: string
  /** optional back link target */
  backTo?: string
  backLabel?: string
}

export function AppHeader({ title, backTo, backLabel = 'Back' }: AppHeaderProps) {
  return (
    <header className="app-header">
      {backTo ? (
        <Link to={backTo} className="app-header__back">
          ← {backLabel}
        </Link>
      ) : (
        <span className="kicker">Build order</span>
      )}
      <h1 className="app-header__title">{title}</h1>
    </header>
  )
}
