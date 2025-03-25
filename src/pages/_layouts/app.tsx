import { Outlet } from 'react-router-dom'
import Header from '../components/header'


export function AppLayout() {
  return (
    <div className=' min-h-screen '>
      <Header menuType='home'/>
      <div className='flex flex-col items-center justify-center w-full'>
        <Outlet />
      </div>
    </div>
  )
}