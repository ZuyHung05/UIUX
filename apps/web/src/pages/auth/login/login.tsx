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
                    <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2.5 5h15c.8 0 1.5.7 1.5 1.5v8c0 .8-.7 1.5-1.5 1.5h-15C1.7 16 1 15.3 1 14.5v-8c0-.8.7-1.5 1.5-1.5z" />
                      <path d="M3 6l7 5 7-5" />
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
                    <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2.5 5h15c.8 0 1.5.7 1.5 1.5v8c0 .8-.7 1.5-1.5 1.5h-15C1.7 16 1 15.3 1 14.5v-8c0-.8.7-1.5 1.5-1.5z" />
                      <path d="M3 6l7 5 7-5" />
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
