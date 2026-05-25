import heroImage from '../../../assets/images/login_smile.png'
import brandIcon from '../../../assets/icons/Icon.svg'
import './login.css'
import React, { useState } from 'react'

export const Login = (): React.ReactElement => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // placeholder: integrate auth flow later
    // For now navigate to doctor dashboard if email contains "doc"
    if (email.includes('doc')) window.location.pathname = '/doctor'
    else window.location.pathname = '/manager'
  }

  return (
    <div className="login">
      <div className="login-inner">
        <aside className="login-visual" aria-hidden>
          <div className="visual-hero">
            <img src={heroImage} alt="Serene illustration" className="visual-illustration" />
            <h2 className="visual-title">Serene Health</h2>
            <p className="visual-sub">Trợ lý y tế thông minh, đồng hành cùng sức khỏe của bạn</p>
            <div className="visual-tags">
              <span className="tag">🤖 AI-Powered</span>
              <span className="tag">💙 Đáng tin cậy</span>
            </div>
          </div>
        </aside>

        <main className="login-form-area">
          <div className="form-shell">
            <div className="form-header">
              <img src={brandIcon} alt="Serene Health" className="brand-mark" />
              <h1>CHÀO MỪNG ĐẾN VỚI SERENE HEALTH</h1>
              <p className="muted">Đăng nhập để sử dụng dịch vụ của hệ thống</p>
            </div>

            <form className="login-form" onSubmit={handleSubmit} aria-label="Đăng nhập">
              <label className="field">
                <span className="field-label">Email / Số điện thoại</span>
                <div className="input-with-icon">
                  <span className="icon email-icon" aria-hidden>
                    <svg viewBox="0 0 20 20" width="18" height="18">
                      <rect
                        x="3"
                        y="5"
                        width="14"
                        height="10"
                        rx="3"
                        stroke="#94A3B8"
                        fill="none"
                        strokeWidth="1.4"
                      />
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Nhập email hoặc số điện thoại"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </label>

              <label className="field">
                <span className="field-label">Mật khẩu</span>
                <div className="input-with-icon">
                  <span className="icon lock-icon" aria-hidden>
                    <svg viewBox="0 0 20 20" width="18" height="18">
                      <path
                        d="M6 8V6a4 4 0 0 1 8 0v2"
                        stroke="#94A3B8"
                        fill="none"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <rect
                        x="4"
                        y="8"
                        width="12"
                        height="8"
                        rx="2"
                        stroke="#94A3B8"
                        fill="none"
                        strokeWidth="1.4"
                      />
                    </svg>
                  </span>
                  <input
                    type="password"
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </label>

              <div className="form-actions-row">
                <label className="remember">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  <span>Ghi nhớ đăng nhập</span>
                </label>
                <a className="forgot" href="#">
                  Quên mật khẩu?
                </a>
              </div>

              <button className="primary" type="submit">
                Đăng nhập
              </button>

              <hr className="divider" />

              <p className="no-account">
                Chưa có tài khoản? <a href="/register">Đăng kí ngay</a>
              </p>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}
