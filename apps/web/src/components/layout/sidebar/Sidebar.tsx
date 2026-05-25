import { SidebarIcon } from './SidebarIcon'
import { SidebarLogo } from './SidebarLogo'
import type { SidebarConfig } from './types'
import './Sidebar.css'

type SidebarProps = {
  config: SidebarConfig
  onItemClick?: (label: string) => void
}

export function Sidebar({ config, onItemClick }: SidebarProps) {
  return (
    <aside className="app-sidebar">
      <div className="brand">
        <SidebarLogo />
        <div>
          <strong>Serene Health</strong>
          <span>Medical Platform</span>
        </div>
      </div>

      <label className="sidebar-search">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="m16.5 16.5 4 4" />
        </svg>
        <input type="search" placeholder="Search here" aria-label="Search here" />
      </label>

      <nav className="sidebar-nav" aria-label="Điều hướng chính">
        {config.groups.map((group) => (
          <section className="nav-group" key={group.title}>
            <h2>{group.title}</h2>
            <div className="nav-items">
              {group.items.map((item) => {
                const isActive = item.label === config.activeLabel

                return (
                  <a
                    className={isActive ? 'nav-item active' : 'nav-item'}
                    href="#"
                    key={item.label}
                    onClick={(e) => {
                      e.preventDefault()
                      if (onItemClick) {
                        onItemClick(item.label)
                      }
                    }}
                  >
                    <SidebarIcon name={item.icon} />
                    <span>{item.label}</span>
                  </a>
                )
              })}
            </div>
          </section>
        ))}
      </nav>

      <button className="logout-button" type="button">
        Đăng xuất
      </button>
    </aside>
  )
}

