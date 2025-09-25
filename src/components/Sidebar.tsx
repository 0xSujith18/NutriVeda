import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Calendar, Search, TrendingUp, User, LogOut, Leaf, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Sidebar: React.FC = () => {
  const { logout, user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { to: '/dashboard', icon: Home, label: 'Dashboard', gradient: 'from-blue-500 to-cyan-500' },
    { to: '/diet-planner', icon: Calendar, label: 'Diet Planner', gradient: 'from-green-500 to-emerald-500' },
    { to: '/food-explorer', icon: Search, label: 'Food Explorer', gradient: 'from-purple-500 to-pink-500' },
    { to: '/progress', icon: TrendingUp, label: 'Progress', gradient: 'from-orange-500 to-red-500' },
    { to: '/profile', icon: User, label: 'Profile', gradient: 'from-indigo-500 to-purple-500' },
  ];

  return (
    <motion.div 
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={`${isCollapsed ? 'w-20' : 'w-72'} bg-white h-screen flex flex-col relative transition-all duration-300 border-r border-green-100 shadow-sm`}
    >

      
      {/* Header */}
      <div className="relative z-10 p-6 border-b border-green-100">
        <div className="flex items-center justify-between">
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center space-x-3"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-green-600">
                    NutriVeda
                  </h1>
                  <p className="text-xs text-gray-500">AI-Powered Wellness</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-all duration-300 border border-gray-200"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4 text-gray-600" /> : <ChevronLeft className="w-4 h-4 text-gray-600" />}
          </button>
        </div>
        
        {/* User Info */}
        <AnimatePresence>
          {!isCollapsed && user && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-4 p-3 bg-green-50 rounded-xl border border-green-100"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 font-medium text-sm truncate">{user.name}</p>
                  <p className="text-gray-500 text-xs">{user.doshaType || 'Complete Profile'}</p>
                </div>
                <Sparkles className="w-4 h-4 text-green-500 animate-pulse" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4 relative z-10">
        <ul className="space-y-2">
          {navItems.map(({ to, icon: Icon, label, gradient }, index) => (
            <motion.li 
              key={to}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `group flex items-center ${isCollapsed ? 'justify-center px-3' : 'space-x-3 px-4'} py-3 rounded-xl transition-all duration-300 relative overflow-hidden ${
                    isActive
                      ? 'bg-green-100 text-green-700 shadow-sm border border-green-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-green-50 rounded-xl"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <div className={`relative z-10 w-6 h-6 flex items-center justify-center ${isActive ? 'bg-green-500 rounded-lg p-1' : ''}`}>
                      <Icon size={isActive ? 16 : 20} className={isActive ? 'text-white' : ''} />
                    </div>
                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="relative z-10 font-medium"
                        >
                          {label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {isActive && !isCollapsed && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 bg-green-500 rounded-full ml-auto"
                      />
                    )}
                  </>
                )}
              </NavLink>
            </motion.li>
          ))}
        </ul>
      </nav>
      
      {/* Footer */}
      <div className="relative z-10 p-4 border-t border-white/10">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={logout}
          className={`group flex items-center ${isCollapsed ? 'justify-center px-3' : 'space-x-3 px-4'} py-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl w-full transition-all duration-300 border border-transparent hover:border-red-200`}
        >
          <LogOut size={20} className="group-hover:text-red-600 transition-colors" />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="font-medium group-hover:text-red-600 transition-colors"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
        
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-4 text-center"
            >
              <p className="text-xs text-gray-400">Version 2.0.0</p>
              <p className="text-xs text-gray-400">© 2024 NutriVeda</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Sidebar;