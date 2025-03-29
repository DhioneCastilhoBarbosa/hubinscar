import { Outlet } from 'react-router-dom'
import Header from '../components/header'
interface AuthLayoutProps {
  menuType?: "home" | "full";
  buttonVisible?: boolean;
  menuVisible?: boolean;
}


export function AuthLayout({menuType, buttonVisible, menuVisible}:AuthLayoutProps) {
  return (
      <div >
        <Header menuType={menuType} buttonVisible={buttonVisible} menuVisible={menuVisible}/>
        <div className='flex flex-col w-full md:h-full'>
          <Outlet />
        </div>
      </div>
    )
}