import { Outlet } from 'react-router-dom'

import HeaderDashboard from '../components/dashboard/components/header'

export function AppLayout() {
  return (
    <div className="min-h-screen">
      <HeaderDashboard/>
      <div className="pt-16 h-screen overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}
