import registerHero from '../../../assets/images/register.png'
import registerIcon from '../../../assets/icons/register_icon.svg'
import './register.css'

import type { ReactNode } from 'react'

type FieldProps = {
  label: string
  children: ReactNode
}

function RegisterField({ label, children }: FieldProps) {
  return (
    <label className="register-field">
      <span>{label}</span>
      {children}
    </label>
  )
}

export function Register() {
  return (
    <div className="register-page">
      <div className="register-shell">
        <aside className="register-visual" aria-hidden="true">
          <div className="register-hero">
            <img src={registerHero} alt="" className="register-illustration" />
            <h2 className="register-brand">Serene Health</h2>
            <p className="register-copy">Trợ lý y tế thông minh, đồng hành cùng sức khỏe của bạn</p>
            <div className="register-pills">
              <span className="register-pill">🤖 AI-Powered</span>
              <span className="register-pill">💙 Đáng tin cậy</span>
            </div>
          </div>
        </aside>

        <main className="register-form-area">
          <div className="register-card">
            <div className="register-header">
              <img src={registerIcon} alt="Serene Health" className="register-icon" />
              <h1>CHÀO MỪNG ĐẾN VỚI SERENE HEALTH</h1>
              <p>Tạo tài khoản mới</p>
            </div>

            <form className="register-form" onSubmit={(e) => e.preventDefault()} aria-label="Đăng ký tài khoản">
              <a className="back-link" href="/login">← Quay lại đăng nhập</a>

              <RegisterField label="Email">
                <input type="email" placeholder="Nhập email" />
              </RegisterField>

              <RegisterField label="Số điện thoại">
                <input type="tel" placeholder="Nhập số điện thoại" />
              </RegisterField>

              <RegisterField label="Họ và tên">
                <input type="text" placeholder="Nhập họ và tên" />
              </RegisterField>

              <RegisterField label="Giới tính">
                <div className="select-wrap">
                  <select defaultValue="">
                    <option value="" disabled>Chọn giới tính</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
              </RegisterField>

              <RegisterField label="Ngày sinh">
                <input type="date" />
              </RegisterField>

              <RegisterField label="Mật khẩu">
                <input type="password" placeholder="Nhập mật khẩu (tối thiểu 8 ký tự)" />
              </RegisterField>

              <RegisterField label="Xác nhận mật khẩu">
                <input type="password" placeholder="Nhập lại mật khẩu" />
              </RegisterField>

              <button className="register-submit" type="submit">Đăng ký</button>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}