import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import './HomePage.css'
import {
  AppointmentIcon,
  BellIcon,
  CalendarIcon,
  HeadacheIcon,
  HistoryIcon,
  HomeIcon,
  MedicineSearchIcon,
  MicIcon,
  ProfileIcon,
  PressureIcon,
  SleepIcon,
  ThermometerIcon,
} from '../../assets/icons/mobileUserHomeIcons'

type SymptomCard = {
  label: string
  icon: ReactNode
}

const symptomCards: SymptomCard[] = [
  {
    label: 'Ho/ sốt',
    icon: <ThermometerIcon />,
  },
  {
    label: 'Đau đầu',
    icon: <HeadacheIcon />,
  },
  {
    label: 'Huyết áp',
    icon: <PressureIcon />,
  },
  {
    label: 'Giấc ngủ',
    icon: <SleepIcon />,
  },
  {
    label: 'Tra cứu thuôc',
    icon: <MedicineSearchIcon />,
  },
  {
    label: 'Đặt lịch khám',
    icon: <AppointmentIcon />,
  },
]

function IconButton({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <button className={`mobile-icon-button ${className}`.trim()} type="button" aria-hidden="true">
      {children}
    </button>
  )
}

function SymptomButton({ label, icon, onSelect }: { label: string; icon: ReactNode; onSelect: (label: string) => void }) {
  return (
    <button className="mobile-symptom-card" type="button" onClick={() => onSelect(label)}>
      <span className="mobile-symptom-icon" aria-hidden="true">
        {icon}
      </span>
      <span>{label}</span>
    </button>
  )
}

function UserAvatar() {
  return (
    <div className="mobile-avatar" aria-hidden="true">
      <svg viewBox="0 0 44 44">
        <circle cx="22" cy="22" r="22" fill="#eef2f7" />
        <circle cx="22" cy="17" r="6" fill="#94a3b8" />
        <path d="M10.5 36a11.5 11.5 0 0 1 23 0" fill="#94a3b8" />
      </svg>
    </div>
  )
}

export function MobileUserHomePage() {
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')

  function handleSymptomSelect(label: string) {
    navigate('/mobile-user/chat', { state: { initialMessage: label } })
  }

  function handleSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      const value = searchText.trim()
      if (!value) return
      navigate('/mobile-user/chat', { state: { initialMessage: value } })
    }
  }

  return (
    <main className="mobile-home-page">
      <div className="mobile-home-screen">
        <header className="mobile-home-header">
          <UserAvatar />
          <div className="mobile-home-header-copy">
            <h1>Xin chào</h1>
            <p>Tôi có thể giúp gì cho bạn ?</p>
          </div>
          <button className="mobile-notification-button" type="button" aria-label="Thông báo">
            <BellIcon />
          </button>
        </header>

        <section className="mobile-hero-card" aria-label="Lịch khám hôm nay">
          <div className="mobile-hero-glow" aria-hidden="true" />
          <div className="mobile-hero-content">
            <h2>Bạn có lịch khám lúc 10:00 hôm nay</h2>
            <p>Phòng khám Đa khoa Tâm Anh, Q.1</p>
            <div className="mobile-hero-actions">
              <button className="mobile-pill-button" type="button">
                <span className="mobile-pill-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M4.5 12.5 12 5l7.5 7.5" />
                    <path d="M7 10v7h10v-7" />
                  </svg>
                </span>
                <span>Xem chi tiết</span>
              </button>
              <div className="mobile-hero-badge" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <rect x="4" y="6" width="16" height="14" rx="3" />
                  <path d="M8 4v4M16 4v4M8 12h8" />
                </svg>
              </div>
            </div>
          </div>
        </section>

        <section className="mobile-intro" aria-label="Giới thiệu trợ lý y tế">
          <p>Tôi là Serena - trợ lý y tế</p>
          <p>
            Tôi có thể giúp tư vấn các triệu chứng đơn giản, gợi ý cách cải thiện hoặc kết nối bạn
            với bác sĩ chuyên môn khi cần thiết.
          </p>
        </section>

        <section className="mobile-search" aria-label="Nhập triệu chứng cần tư vấn">
          <IconButton>
            <MicIcon />
          </IconButton>
          <input
            className="mobile-search-input"
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Bạn cần tư vấn triệu chứng gì"
            aria-label="Tìm kiếm triệu chứng"
          />
        </section>

        <section className="mobile-symptoms-grid" aria-label="Lựa chọn triệu chứng">
          {symptomCards.map((item) => (
            <SymptomButton key={item.label} label={item.label} icon={item.icon} onSelect={handleSymptomSelect} />
          ))}
        </section>

        <nav className="mobile-bottom-nav" aria-label="Điều hướng chính">
          <button className="mobile-bottom-nav-item is-active" type="button" aria-current="page">
            <span className="mobile-bottom-nav-icon">
              <HomeIcon />
            </span>
            <span>Trang chủ</span>
          </button>
          <button className="mobile-bottom-nav-item" type="button">
            <span className="mobile-bottom-nav-icon">
              <HistoryIcon />
            </span>
            <span>Lịch sử</span>
          </button>
          <button className="mobile-bottom-nav-item" type="button">
            <span className="mobile-bottom-nav-icon">
              <CalendarIcon />
            </span>
            <span>Lịch hẹn</span>
          </button>
          <button className="mobile-bottom-nav-item" type="button">
            <span className="mobile-bottom-nav-icon mobile-bottom-nav-icon-profile">
              <ProfileIcon />
            </span>
            <span>Cá nhân</span>
          </button>
        </nav>
      </div>
    </main>
  )
}
