import './Header.css'

type HeaderProps = {
  profileRole: string
}

export function Header({ profileRole }: HeaderProps) {
  return (
    <header className="app-header">
      <div className="header-profile">
        <div className="profile-text">
          <strong>Profile Name</strong>
          <span>{profileRole}</span>
        </div>
        <div className="profile-avatar" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="8" r="4" />
            <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
          </svg>
        </div>
      </div>
    </header>
  )
}

