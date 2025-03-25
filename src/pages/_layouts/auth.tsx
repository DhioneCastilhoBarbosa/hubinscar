import { Outlet } from 'react-router-dom'
import Header from '../components/header'
interface AuthLayoutProps {
  menuType?: "home" | "full";
  buttonVisible?: boolean;
}


export function AuthLayout({menuType, buttonVisible}:AuthLayoutProps) {
  return (
      <div >
        <Header menuType={menuType} buttonVisible={buttonVisible}/>
        <div className='flex flex-col w-full md:h-full'>
          <Outlet />
        </div>
      </div>
    )
}