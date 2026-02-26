'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const Sidebar = () => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/admin' },
    { name: 'Events', href: '/admin/events' },
    { name: 'Tickets', href: '/admin/tickets' },
    { name: 'Users', href: '/admin/users' },
    { name: 'Payments', href: '/admin/payments' },
  ];

  return (
    <aside className="w-64 bg-white shadow-sm h-screen fixed left-0 top-0">
      <div className="p-6">
        <h2 className="text-xl font-bold text-green-700">SunuLamb Admin</h2>
      </div>
      <nav className="mt-6">
        <ul>
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`block py-3 px-6 text-sm ${
                  pathname === item.href ? 'bg-green-50 text-green-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;