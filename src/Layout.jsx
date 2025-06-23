import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { routeArray } from './config/routes';
import ApperIcon from './components/ApperIcon';

const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-surface-50">
      {/* Header */}
      <header className="flex-shrink-0 h-16 bg-white border-b border-surface-200 px-4 md:px-6 z-40">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-surface-100 transition-colors"
            >
              <ApperIcon name="Menu" size={20} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <ApperIcon name="Heart" size={16} className="text-white" />
              </div>
              <h1 className="text-xl font-semibold text-surface-900">MediFlow</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-lg hover:bg-surface-100 transition-colors relative">
              <ApperIcon name="Bell" size={20} className="text-surface-600" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <ApperIcon name="User" size={16} className="text-white" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-surface-900">Dr. Admin</p>
                <p className="text-xs text-surface-500">Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 bg-white border-r border-surface-200 overflow-y-auto z-40">
          <nav className="p-4 space-y-2">
            {routeArray.map(route => (
              <NavLink
                key={route.id}
                to={route.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-surface-700 hover:bg-surface-100 hover:text-surface-900'
                  }`
                }
              >
                <ApperIcon name={route.icon} size={18} />
                {route.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-50"
            onClick={closeMobileMenu}
          >
            <div
              className="absolute left-0 top-0 bottom-0 w-64 bg-white overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-surface-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <ApperIcon name="Heart" size={16} className="text-white" />
                  </div>
                  <h1 className="text-xl font-semibold text-surface-900">MediFlow</h1>
                </div>
              </div>
              <nav className="p-4 space-y-2">
                {routeArray.map(route => (
                  <NavLink
                    key={route.id}
                    to={route.path}
                    onClick={closeMobileMenu}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150 ${
                        isActive
                          ? 'bg-primary text-white shadow-sm'
                          : 'text-surface-700 hover:bg-surface-100 hover:text-surface-900'
                      }`
                    }
                  >
                    <ApperIcon name={route.icon} size={18} />
                    {route.label}
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;