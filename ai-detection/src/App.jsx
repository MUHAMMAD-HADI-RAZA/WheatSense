import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, ScanLine, BarChart3, Info, BookOpen,
  Sun, Moon, Menu, X, Cpu, Bell, ChevronRight,
  Settings, Leaf
} from 'lucide-react';
import Home from './pages/Home';
import Detect from './pages/Detect';
import Analytics from './pages/Analytics';
import Manual from './pages/Manual';
import About from './pages/About';
import NotFound from './pages/NotFound';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/detect', label: 'Detection', icon: ScanLine },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/manual', label: 'Manual', icon: BookOpen },
  { path: '/about', label: 'About', icon: Info },
];

function Sidebar({ isMobileOpen, setIsMobileOpen, darkMode, toggleDarkMode }) {
  const location = useLocation();

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
        style={{
          background: 'var(--sidebar-bg)',
          borderRight: '1px solid var(--sidebar-border)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b" style={{ borderColor: 'var(--sidebar-border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md" style={{ background: 'linear-gradient(135deg,#10b981,#059669)' }}>
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-base font-black text-gray-900 dark:text-white tracking-tight">WheatSense</span>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">AI Platform</div>
            </div>
          </div>
          <button className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setIsMobileOpen(false)}>
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <div className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 px-3 mb-3">Main Menu</div>

          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon className="w-4.5 h-4.5 flex-shrink-0" style={{ width: '18px', height: '18px' }} />
                <span>{item.label}</span>
                {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-60" />}
              </Link>
            );
          })}

          <div className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 px-3 mt-5 mb-3">System</div>
          <div className="nav-item opacity-50 cursor-not-allowed select-none">
            <Settings style={{ width: '18px', height: '18px' }} />
            <span>Settings</span>
            <span className="ml-auto text-[10px] bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded-full font-bold">Soon</span>
          </div>
        </nav>

        {/* Model Status */}
        <div className="mx-3 mb-3 p-3 rounded-xl" style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.2)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Cpu className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">AI Models Status</span>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500 dark:text-gray-400">YOLOv8 (best.pt)</span>
              <span className="badge badge-emerald">Online</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500 dark:text-gray-400">YOLOv10 Nano</span>
              <span className="badge badge-emerald">Online</span>
            </div>
          </div>
        </div>

        {/* Dark Mode Toggle */}
        <div className="p-3 border-t" style={{ borderColor: 'var(--sidebar-border)' }}>
          <button
            onClick={toggleDarkMode}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
            style={{ color: 'var(--text-muted)' }}
          >
            {darkMode
              ? <Sun className="w-4 h-4 text-amber-500" />
              : <Moon className="w-4 h-4 text-blue-500" />
            }
            {darkMode ? 'Light Mode' : 'Dark Mode'}
            <div className={`ml-auto w-9 h-5 rounded-full transition-colors relative ${darkMode ? 'bg-emerald-500' : 'bg-gray-300'}`}>
              <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-[3px] shadow transition-transform duration-300 ${darkMode ? 'translate-x-[18px]' : 'translate-x-[3px]'}`} />
            </div>
          </button>
        </div>
      </aside>
    </>
  );
}

function TopBar({ darkMode, toggleDarkMode, setIsMobileOpen }) {
  const location = useLocation();
  const currentPage = navItems.find(n => n.path === location.pathname)?.label || 'Dashboard';

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-8 py-3 border-b backdrop-blur-xl"
      style={{ background: 'var(--header-bg)', borderColor: 'var(--border-color)' }}
    >
      {/* Left: hamburger + breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Menu className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
        </button>
        <div>
          <h2 className="text-base font-bold" style={{ color: 'var(--text-color)' }}>{currentPage}</h2>
          <div className="text-xs hidden sm:flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
            <Leaf className="w-3 h-3 text-emerald-500" />
            WheatSense Platform
            <ChevronRight className="w-3 h-3 mx-0.5" />
            {currentPage}
          </div>
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        {/* AI Status Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border"
          style={{ borderColor: 'rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.07)', color: '#10b981' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          2 Models Live
        </div>

        {/* Notification */}
        <button className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <Bell className="w-4.5 h-4.5" style={{ width: '18px', height: '18px', color: 'var(--text-muted)' }} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {darkMode
            ? <Sun className="w-4.5 h-4.5 text-amber-400" style={{ width: '18px', height: '18px' }} />
            : <Moon className="w-4.5 h-4.5 text-blue-500" style={{ width: '18px', height: '18px' }} />
          }
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l" style={{ borderColor: 'var(--border-color)' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md"
            style={{ background: 'linear-gradient(135deg,#10b981,#3b82f6)' }}>
            WS
          </div>
        </div>
      </div>
    </header>
  );
}

function MainLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen flex transition-colors duration-300" style={{ background: 'var(--bg-color)' }}>
      <Sidebar
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(d => !d)}
      />

      {/* Main */}
      <div className="flex-1 flex flex-col lg:pl-64 min-h-screen">
        <TopBar
          darkMode={darkMode}
          toggleDarkMode={() => setDarkMode(d => !d)}
          setIsMobileOpen={setIsMobileOpen}
        />

        <main className="flex-1 p-4 md:p-8 animate-fade-in">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/detect" element={<Detect />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/manual" element={<Manual />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}
