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

export default function App() {
  return (
    <BrowserRouter>
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
            <AuthLayout menuType="full" buttonVisible={true} menuVisible={true} headModel={false} />
          }
        >
          <Route index element={<Contact/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
