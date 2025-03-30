import { Outlet } from 'react-router-dom'
import Header from '../components/header'
import HeaderNavPages from '../components/headerNavPage';
interface AuthLayoutProps {
  menuType?: "home" | "full";
  buttonVisible?: boolean;
  menuVisible?: boolean;
  headModel?: boolean;
}


export function AuthLayout({menuType, buttonVisible, menuVisible, headModel}:AuthLayoutProps) {
  return (
      <div>
        { headModel 
        ?
        (<Header menuType={menuType} buttonVisible={buttonVisible} menuVisible={menuVisible}/>)
        :
        (<HeaderNavPages menuType={menuType} buttonVisible={buttonVisible} menuVisible={menuVisible}/>)}
        
        <div className='flex flex-col w-full md:h-full'>
          <Outlet />
        </div>
      </div>
    )
}