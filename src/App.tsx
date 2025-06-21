import './global.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Main from './pages/components/main/main'
import SignIn from './pages/components/Sigin/signIn'
import Budget from './pages/components/budget/budget'
import RegisterClient from './pages/components/register/register'
import Partners from './pages/components/partners/partners'
import RegisterPart from './pages/components/register/registerInstaller'
import { AuthLayout } from './pages/_layouts/auth'
import Contact from './pages/components/contact/contact'
import Dashboard from './pages/components/dashboard/dashboard'
import { AppLayout } from './pages/_layouts/app'
import PoliticaDePrivacidade from './pages/components/politicadePrivacidade/PoliticaDePrivacidade'
import TermosDeUso from './pages/components/termoDeUso/TermoDeUso'
import CookieBanner from './pages/components/cookieBanner/CookieBanner'

import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'



export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={
              <AuthLayout menuType="full" buttonVisible={true} menuVisible={true} headModel={true} />
            }
          >
            <Route index element={<Main />} />
          </Route>

          <Route
            path="/signin"
            element={
              <AuthLayout menuType="home" buttonVisible={false} headModel={true} />
            }
          >
            <Route index element={<SignIn />} />
          </Route>

          <Route
            path="/register"
            element={
              <AuthLayout menuType="full" buttonVisible={true} menuVisible={true} headModel={false} />
            }
          >
            <Route index element={<RegisterClient />} />
          </Route>

          <Route
            path="/budget"
            element={
              <AuthLayout menuType="full" buttonVisible={true} menuVisible={true} headModel={false} />
            }
          >
            <Route index element={<Budget />} />
          </Route>

          <Route
            path="/parceiros"
            element={
              <AuthLayout menuType="full" buttonVisible={true} menuVisible={true} headModel={false} />
            }
          >
            <Route index element={<Partners />} />
          </Route>

          <Route
            path="/cadastro-parceiro"
            element={
              <AuthLayout menuType="full" buttonVisible={true} menuVisible={true} headModel={false} />
            }
          >
            <Route index element={<RegisterPart />} />
          </Route>

          <Route
            path="/contato"
            element={
              <AuthLayout menuType="full" buttonVisible={false} menuVisible={true} headModel={false} />
            }
          >
            <Route index element={<Contact />} />
          </Route>

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
          </Route>

          <Route
            path="/politica-de-privacidade"
            element={
              
              <AuthLayout menuType="full" buttonVisible={false} menuVisible={true} headModel={false} />
            }
          >
            <Route index element={<PoliticaDePrivacidade />} />
          </Route>

          <Route
            path="/termos-de-uso"
            element={
              <AuthLayout menuType="full" buttonVisible={false} menuVisible={true} headModel={false} />
            }
          >
            <Route index element={<TermosDeUso />} />
          </Route>
        </Routes>
        <CookieBanner />
      </AuthProvider>
    </BrowserRouter>
  )
}
