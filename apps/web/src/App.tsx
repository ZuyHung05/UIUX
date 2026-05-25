import { Login } from './pages/auth/login/login'
import { Register } from './pages/auth/register/register'
import { ManagerDashboardPage } from './pages/manager/ManagerDashboardPage'
import { DoctorDashboardPage } from './pages/doctor/DoctorDashboardPage'

const routeMap = {
  login: <Login />,
  register: <Register />,
  manager: <ManagerDashboardPage />,
  doctor: <DoctorDashboardPage />,
}

type RouteName = keyof typeof routeMap

function getCurrentRoute(): RouteName {
  const pathname = window.location.pathname.replace(/^\/+/, '').trim()

  if (pathname === 'login' || pathname === 'register' || pathname === 'doctor' || pathname === 'manager') {
    return pathname
  }

  return 'login'
}

function App() {
  const currentRoute = getCurrentRoute()

  return routeMap[currentRoute]
}

export default App
