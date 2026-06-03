import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import sereneHealthLogo from '../../assets/icons/serene_health_logo_blue_2.svg'
import { useToast } from '../../components/ui/Toast'
import './AuthPage.css'

type AuthMode = 'login' | 'forgot' | 'signup' | 'forgotLoading' | 'forgotSuccess'
type AccountRole = 'doctor' | 'manager' | 'expert'

type Account = {
  email: string
  phone: string
  fullName: string
  password: string
  role: AccountRole
}

type LoginForm = {
  identifier: string
  password: string
  remember: boolean
}

type ForgotForm = {
  identifier: string
  sentPassword: string
}

type SignupForm = {
  email: string
  phone: string
  fullName: string
  gender: string
  birthday: string
  password: string
  confirmPassword: string
}

type FormErrors<T extends string> = Partial<Record<T, string>>

const DEFAULT_PASSWORD = '12345678'

const initialAccounts: Account[] = [
  {
    email: 'doctor@gmail.com',
    phone: '0900000001',
    fullName: 'Nguyễn Minh Anh',
    password: DEFAULT_PASSWORD,
    role: 'doctor',
  },
  {
    email: 'manager@gmail.com',
    phone: '0900000002',
    fullName: 'Trần Hoài Nam',
    password: DEFAULT_PASSWORD,
    role: 'manager',
  },
  {
    email: 'expert@gmail.com',
    phone: '0900000003',
    fullName: 'Chuyên gia',
    password: DEFAULT_PASSWORD,
    role: 'expert',
  },
]

const initialLoginForm: LoginForm = {
  identifier: '',
  password: '',
  remember: false,
}

const initialForgotForm: ForgotForm = {
  identifier: '',
  sentPassword: '',
}

const initialSignupForm: SignupForm = {
  email: '',
  phone: '',
  fullName: '',
  gender: '',
  birthday: '',
  password: '',
  confirmPassword: '',
}

const emailIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22 6l-10 7L2 6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const lockIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 11V7a5 5 0 0110 0v4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const phoneIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const userIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

function findAccount(accounts: Account[], identifier: string) {
  const normalized = identifier.trim().toLowerCase()

  return accounts.find(
    (account) => account.email.toLowerCase() === normalized || account.phone === normalized,
  )
}

function emailLooksValid(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

function phoneLooksValid(phone: string) {
  return /^\d{10}$/.test(phone.trim())
}

function identifierLooksValid(identifier: string) {
  const value = identifier.trim()
  return emailLooksValid(value) || phoneLooksValid(value)
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null
  }

  return <p className="auth-field-error">{message}</p>
}

type TextFieldProps = {
  id: string
  label: string
  value: string
  placeholder: string
  type?: string
  error?: string
  helper?: string
  compact?: boolean
  autoComplete?: string
  inputMode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search'
  onChange: (value: string) => void
  onFocus?: () => void
  icon?: React.ReactNode
  isPassword?: boolean
}

function TextField({
  id,
  label,
  value,
  placeholder,
  type = 'text',
  error,
  helper,
  compact,
  autoComplete,
  inputMode,
  onChange,
  onFocus,
  icon,
  isPassword
}: TextFieldProps) {
  const [showPassword, setShowPassword] = useState(false)
  const actualType = isPassword ? (showPassword ? 'text' : 'password') : type

  return (
    <label className={compact ? 'auth-field auth-field-compact' : 'auth-field'} htmlFor={id}>
      <span>{label}</span>
      <div className="auth-input-wrapper">
        {icon && <span className="auth-input-icon">{icon}</span>}
        <input
          aria-describedby={error ? `${id}-error` : undefined}
          aria-invalid={Boolean(error)}
          autoComplete={autoComplete}
          className={`${error ? 'is-invalid' : ''} ${icon ? 'has-icon' : ''}`}
          id={id}
          inputMode={inputMode}
          onChange={(event) => onChange(event.target.value)}
          onFocus={onFocus}
          placeholder={placeholder}
          type={actualType}
          value={value}
        />
        {isPassword && (
          <button 
            type="button" 
            className="auth-password-toggle" 
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          >
            {showPassword ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        )}
      </div>
      {helper ? <p className="auth-field-helper">{helper}</p> : null}
      {error ? (
        <p className="auth-field-error" id={`${id}-error`}>
          {error}
        </p>
      ) : null}
    </label>
  )
}

function AuthBackground() {
  return (
    <div className="auth-background" aria-hidden="true">
      <div className="auth-base-gradient" />
      <div className="auth-blob auth-blob-blue" />
      <div className="auth-blob auth-blob-purple" />
      <div className="auth-blob auth-blob-mint" />
      <div className="auth-blob auth-blob-sky" />
      <div className="auth-bubble auth-bubble-1" />
      <div className="auth-bubble auth-bubble-2" />
      <div className="auth-bubble auth-bubble-3" />
      <div className="auth-bubble auth-bubble-4" />
      <div className="auth-bubble auth-bubble-5" />
      <div className="auth-bubble auth-bubble-6" />
      <div className="auth-bubble auth-bubble-7" />
      <div className="auth-bubble auth-bubble-8" />
    </div>
  )
}

function AuthHeader({ mode }: { mode: AuthMode }) {
  const subtitle = (() => {
    if (mode === 'forgot' || mode === 'forgotLoading' || mode === 'forgotSuccess') {
      return 'Nhập thông tin khôi phục để thiết lập lại mật khẩu của bạn'
    }

    if (mode === 'signup') {
      return 'Tạo tài khoản để bắt đầu sử dụng các dịch vụ của hệ thống'
    }

    return 'Đăng nhập để trải nghiệm các dịch vụ của hệ thống'
  })()

  return (
    <header className="auth-header">
      <img className="auth-header-logo" src={sereneHealthLogo} alt="Serene Health" />
      <h1>Serene Health</h1>
      <p>{subtitle}</p>
    </header>
  )
}

export function AuthPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [mode, setMode] = useState<AuthMode>('login')
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts)
  const [loginForm, setLoginForm] = useState<LoginForm>(initialLoginForm)
  const [forgotForm, setForgotForm] = useState<ForgotForm>(initialForgotForm)
  const [signupForm, setSignupForm] = useState<SignupForm>(initialSignupForm)
  const [loginErrors, setLoginErrors] = useState<FormErrors<'identifier' | 'password'>>({})
  const [forgotErrors, setForgotErrors] = useState<FormErrors<'identifier' | 'sentPassword'>>({})
  const [signupErrors, setSignupErrors] = useState<FormErrors<keyof SignupForm>>({})
  const [forgotStatus, setForgotStatus] = useState('')
  const [loginStatus, setLoginStatus] = useState('')

  const accountByIdentifier = useMemo(
    () => findAccount(accounts, forgotForm.identifier),
    [accounts, forgotForm.identifier],
  )

  useEffect(() => {
    if (mode !== 'forgotLoading') {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      setMode('forgotSuccess')
    }, 3000)

    return () => window.clearTimeout(timeoutId)
  }, [mode])

  function resetToLogin(message = '') {
    setMode('login')
    setLoginForm(initialLoginForm)
    setForgotForm(initialForgotForm)
    setSignupForm(initialSignupForm)
    setLoginErrors({})
    setForgotErrors({})
    setSignupErrors({})
    setForgotStatus('')
    setLoginStatus(message)
  }

  function updateLoginField<Key extends keyof LoginForm>(field: Key, value: LoginForm[Key]) {
    setLoginForm((current) => ({ ...current, [field]: value }))
    setLoginErrors((current) => ({ ...current, [field]: undefined }))
  }

  function updateForgotField<Key extends keyof ForgotForm>(field: Key, value: ForgotForm[Key]) {
    setForgotForm((current) => ({ ...current, [field]: value }))
    setForgotErrors((current) => ({ ...current, [field]: undefined }))
    if (field === 'identifier') {
      setForgotStatus('')
    }
  }

  function updateSignupField<Key extends keyof SignupForm>(field: Key, value: SignupForm[Key]) {
    setSignupForm((current) => ({ ...current, [field]: value }))
    setSignupErrors((current) => ({ ...current, [field]: undefined }))
  }

  function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const errors: FormErrors<'identifier' | 'password'> = {}
    const identifier = loginForm.identifier.trim()

    if (!identifier) {
      errors.identifier = 'Vui lòng nhập email hoặc số điện thoại.'
    } else if (!identifierLooksValid(identifier)) {
      errors.identifier = 'Vui lòng nhập email hoặc số điện thoại hợp lệ.'
    }

    if (!loginForm.password.trim()) {
      errors.password = 'Vui lòng nhập mật khẩu.'
    }

    if (Object.keys(errors).length > 0) {
      setLoginErrors(errors)
      return
    }

    const account = findAccount(accounts, identifier)
    if (!account) {
      setLoginErrors({
        identifier: 'Tài khoản không tồn tại. Vui lòng thử lại!',
      })
      return
    }

    if (loginForm.password.length < 8) {
      setLoginErrors({ password: 'Mật khẩu phải đủ 8 kí tự.' })
      return
    }

    if (account.password !== loginForm.password) {
      setLoginErrors({ password: 'Mật khẩu không chính xác. Vui lòng thử lại!' })
      return
    }

    setLoginErrors({})
    setLoginStatus('')
    showToast('Đăng nhập thành công!')
    window.setTimeout(() => {
      if (account.role === 'doctor') {
        navigate('/doctor/dashboard')
        return
      }

      if (account.role === 'expert') {
        window.localStorage.removeItem('serena-expert-workflow-state-v1')
        window.sessionStorage.removeItem('serena-expert-flash-message')
        navigate('/dashboard')
        return
      }

      navigate('/manager/dashboard')
    }, 650)
  }

  function sendRecoveryCode() {
    if (!forgotForm.identifier.trim()) {
      setForgotStatus('')
      setForgotErrors({ identifier: 'Vui lòng nhập email hoặc số điện thoại.' })
      return
    }

    if (!identifierLooksValid(forgotForm.identifier)) {
      setForgotStatus('')
      setForgotErrors({ identifier: 'Vui lòng nhập email hoặc số điện thoại hợp lệ.' })
      return
    }

    if (!accountByIdentifier) {
      setForgotStatus('')
      setForgotErrors({
        identifier: 'Email hoặc số điện thoại không tồn tại. Vui lòng thử lại!',
      })
      return
    }

    setForgotErrors((current) => ({ ...current, identifier: undefined }))
    setForgotStatus('Đã gửi mã khôi phục. Vui lòng kiểm tra email hoặc số điện thoại.')
  }

  function submitForgot(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!forgotForm.identifier.trim()) {
      setForgotStatus('')
      setForgotErrors({ identifier: 'Vui lòng nhập email hoặc số điện thoại.' })
      return
    }

    const account = findAccount(accounts, forgotForm.identifier)
    if (!account) {
      setForgotStatus('')
      setForgotErrors({
        identifier: 'Email hoặc số điện thoại không tồn tại. Vui lòng thử lại!',
      })
      return
    }

    if (forgotForm.sentPassword !== account.password) {
      setForgotErrors({ sentPassword: 'Mật khẩu chưa chính xác. Vui lòng thử lại!' })
      return
    }

    setForgotErrors({})
    setForgotStatus('')
    setMode('forgotLoading')
  }

  function submitSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const errors: FormErrors<keyof SignupForm> = {}
    const email = signupForm.email.trim()
    const phone = signupForm.phone.trim()
    const fullName = signupForm.fullName.trim()

    if (!email) {
      errors.email = 'Vui lòng nhập email.'
    } else if (!emailLooksValid(email)) {
      errors.email = 'Email không đúng định dạng, vui lòng nhập lại.'
    }

    if (!phone) {
      errors.phone = 'Vui lòng nhập số điện thoại.'
    } else if (!phoneLooksValid(phone)) {
      errors.phone = 'Số điện thoại phải đủ 10 số.'
    }

    const existedAccount = accounts.find(
      (account) => account.email.toLowerCase() === email.toLowerCase() || account.phone === phone,
    )

    if (existedAccount) {
      errors.email = 'Email hoặc số điện thoại đã tồn tại.'
    }

    if (!fullName) {
      errors.fullName = 'Vui lòng nhập họ và tên.'
    } else if (fullName.length > 255) {
      errors.fullName = 'Họ và tên giới hạn 255 kí tự.'
    }

    if (!signupForm.gender) {
      errors.gender = 'Vui lòng chọn giới tính.'
    }

    if (!signupForm.birthday) {
      errors.birthday = 'Vui lòng nhập ngày sinh.'
    }

    if (!signupForm.password) {
      errors.password = 'Vui lòng nhập mật khẩu.'
    } else if (signupForm.password.length < 8) {
      errors.password = 'Mật khẩu phải đủ 8 kí tự.'
    }

    if (!signupForm.confirmPassword) {
      errors.confirmPassword = 'Vui lòng xác nhận mật khẩu.'
    } else if (signupForm.confirmPassword !== signupForm.password) {
      errors.confirmPassword = 'Mật khẩu xác nhận không khớp với mật khẩu đã nhập.'
    }

    if (Object.keys(errors).length > 0) {
      setSignupErrors(errors)
      return
    }

    setAccounts((current) => [
      ...current,
      {
        email,
        phone,
        fullName,
        password: signupForm.password,
        role: 'doctor',
      },
    ])
    resetToLogin('Đăng kí thành công, vui lòng đăng nhập.')
  }

  function renderLogin() {
    return (
      <form className="auth-modal-form auth-login-form" onSubmit={submitLogin} noValidate>
        {loginStatus ? <p className="auth-success-line">{loginStatus}</p> : null}
        <TextField
          autoComplete="username"
          error={loginErrors.identifier}
          id="login-identifier"
          inputMode="email"
          label="Email / Số điện thoại"
          onChange={(value) => updateLoginField('identifier', value)}
          onFocus={() => setLoginErrors((current) => ({ ...current, identifier: undefined }))}
          placeholder="Nhập email hoặc số điện thoại"
          value={loginForm.identifier}
          icon={emailIcon}
        />
        <TextField
          autoComplete="current-password"
          error={loginErrors.password}
          id="login-password"
          label="Mật khẩu"
          onChange={(value) => updateLoginField('password', value)}
          onFocus={() => setLoginErrors((current) => ({ ...current, password: undefined }))}
          placeholder="Nhập mật khẩu"
          type="password"
          value={loginForm.password}
          icon={lockIcon}
          isPassword
        />

        <div className="auth-login-options">
          <label className="auth-remember">
            <input
              checked={loginForm.remember}
              onChange={(event) => updateLoginField('remember', event.target.checked)}
              type="checkbox"
            />
            <span>Ghi nhớ đăng nhập</span>
          </label>
          <button className="auth-link-button" onClick={() => setMode('forgot')} type="button">
            Quên mật khẩu?
          </button>
        </div>

        <button className="auth-primary-button" type="submit">
          Đăng nhập
        </button>
        <hr className="auth-separator" />
        <p className="auth-register-prompt">
          <span>Chưa có tài khoản? </span>
          <button className="auth-inline-link" onClick={() => setMode('signup')} type="button">
            Đăng kí ngay
          </button>
        </p>
      </form>
    )
  }

  function renderForgot() {
    return (
      <form className="auth-modal-form auth-forgot-form" onSubmit={submitForgot} noValidate>
        <button className="auth-back-button" onClick={() => resetToLogin()} type="button">
          <span aria-hidden="true">‹</span>
          Quay lại trang đăng nhập
        </button>
        <div className="auth-recovery-row">
          <TextField
            autoComplete="username"
            error={forgotErrors.identifier}
            id="forgot-identifier"
            inputMode="email"
            label="Email / Số điện thoại khôi phục"
            onChange={(value) => updateForgotField('identifier', value)}
            onFocus={() => setForgotErrors((current) => ({ ...current, identifier: undefined }))}
            placeholder="Nhập email hoặc số điện thoại"
            value={forgotForm.identifier}
            icon={emailIcon}
          />
          <button className="auth-send-code-button" onClick={sendRecoveryCode} type="button">
            Gửi mã
          </button>
        </div>
        {forgotStatus ? <p className="auth-success-line forgot-status">{forgotStatus}</p> : null}
        <TextField
          autoComplete="new-password"
          error={forgotErrors.sentPassword}
          helper="Mật khẩu mới được hệ thống gửi về email hoặc số điện thoại khôi phục của bạn."
          id="forgot-password"
          label="Mật khẩu mới"
          onChange={(value) => updateForgotField('sentPassword', value)}
          onFocus={() => setForgotErrors((current) => ({ ...current, sentPassword: undefined }))}
          placeholder="Nhập mật khẩu mới được gửi"
          type="password"
          value={forgotForm.sentPassword}
          icon={lockIcon}
          isPassword
        />
        <button className="auth-primary-button" type="submit">
          Xác nhận
        </button>
      </form>
    )
  }

  function renderForgotLoading() {
    return (
      <div className="auth-modal-state">
        <div className="auth-loader" aria-label="Đang xử lý" />
        <p>Đang xác nhận mật khẩu mới...</p>
      </div>
    )
  }

  function renderForgotSuccess() {
    return (
      <div className="auth-modal-state">
        <h3>Đã đổi mật khẩu thành công</h3>
        <p>Bạn có thể quay lại trang đăng nhập và sử dụng mật khẩu mới.</p>
        <button className="auth-primary-button auth-wide-button" onClick={() => resetToLogin()} type="button">
          Quay lại trang đăng nhập
        </button>
      </div>
    )
  }

  function renderSignup() {
    return (
      <form className="auth-modal-form auth-signup-form" onSubmit={submitSignup} noValidate>
        <button className="auth-back-button" onClick={() => resetToLogin()} type="button">
          <span aria-hidden="true">‹</span>
          Quay lại trang đăng nhập
        </button>
        <div className="auth-signup-grid">
          <TextField
            autoComplete="email"
            compact
            error={signupErrors.email}
            id="signup-email"
            inputMode="email"
            label="Email"
            onChange={(value) => updateSignupField('email', value)}
            placeholder="email@example.com"
            type="email"
            value={signupForm.email}
            icon={emailIcon}
          />
          <TextField
            autoComplete="tel"
            compact
            error={signupErrors.phone}
            id="signup-phone"
            inputMode="tel"
            label="Số điện thoại"
            onChange={(value) => updateSignupField('phone', value.replace(/\D/g, '').slice(0, 10))}
            placeholder="10 chữ số"
            value={signupForm.phone}
            icon={phoneIcon}
          />
          <TextField
            autoComplete="name"
            compact
            error={signupErrors.fullName}
            id="signup-full-name"
            label="Họ và tên"
            onChange={(value) => updateSignupField('fullName', value)}
            placeholder="Nhập họ và tên"
            value={signupForm.fullName}
            icon={userIcon}
          />
          <label className="auth-field auth-field-compact" htmlFor="signup-gender">
            <span>Giới tính</span>
            <select
              aria-invalid={Boolean(signupErrors.gender)}
              className={signupErrors.gender ? 'is-invalid' : ''}
              id="signup-gender"
              onChange={(event) => updateSignupField('gender', event.target.value)}
              onFocus={() => setSignupErrors((current) => ({ ...current, gender: undefined }))}
              value={signupForm.gender}
            >
              <option value="">Chọn giới tính</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
            <FieldError message={signupErrors.gender} />
          </label>
          <TextField
            autoComplete="bday"
            compact
            error={signupErrors.birthday}
            id="signup-birthday"
            label="Ngày sinh"
            onChange={(value) => updateSignupField('birthday', value)}
            placeholder="dd/mm/yyyy"
            type="date"
            value={signupForm.birthday}
          />
          <TextField
            autoComplete="new-password"
            compact
            error={signupErrors.password}
            id="signup-password"
            label="Mật khẩu"
            onChange={(value) => updateSignupField('password', value)}
            placeholder="Tối thiểu 8 kí tự"
            type="password"
            value={signupForm.password}
            icon={lockIcon}
            isPassword
          />
          <TextField
            autoComplete="new-password"
            compact
            error={signupErrors.confirmPassword}
            id="signup-confirm-password"
            label="Xác nhận mật khẩu"
            onChange={(value) => updateSignupField('confirmPassword', value)}
            placeholder="Nhập lại mật khẩu"
            type="password"
            value={signupForm.confirmPassword}
            icon={lockIcon}
            isPassword
          />
        </div>
        <button className="auth-primary-button" type="submit">
          Đăng kí
        </button>
      </form>
    )
  }

  return (
    <main className="auth-page">
      <AuthBackground />
      <section className={`auth-modal auth-modal-${mode}`} aria-label="Biểu mẫu xác thực">
        <div className="auth-modal-scroll">
          <AuthHeader mode={mode} />
          {mode === 'login' ? renderLogin() : null}
          {mode === 'forgot' ? renderForgot() : null}
          {mode === 'forgotLoading' ? renderForgotLoading() : null}
          {mode === 'forgotSuccess' ? renderForgotSuccess() : null}
          {mode === 'signup' ? renderSignup() : null}
        </div>
      </section>
    </main>
  )
}
