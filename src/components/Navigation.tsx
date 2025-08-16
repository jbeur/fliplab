'use client';

interface NavigationProps {
  currentView: 'dashboard' | 'scanner' | 'inventory' | 'sales';
  onViewChange: (view: 'dashboard' | 'scanner' | 'inventory' | 'sales') => void;
}

export default function Navigation({ currentView, onViewChange }: NavigationProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'scanner', label: 'Scanner', icon: '📱' },
    { id: 'inventory', label: 'Inventory', icon: '📦' },
    { id: 'sales', label: 'Sales', icon: '💰' }
  ] as const;

  return (
    <nav className="bg-white border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
                           <div className="flex items-center">
                   <div className="text-2xl font-bold text-blue-600">FlipLab</div>
                 </div>

          {/* Navigation Items */}
          <div className="flex space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentView === item.id
                    ? 'bg-blue-100 text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>

          {/* User Menu Placeholder */}
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      </div>
    </nav>
  );
}
