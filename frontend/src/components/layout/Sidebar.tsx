'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  XMarkIcon,
  HomeIcon,
  AcademicCapIcon,
  UserGroupIcon,
  DocumentTextIcon,
  PencilSquareIcon,
  ChartBarIcon,
  PuzzlePieceIcon,
  ChatBubbleLeftIcon,
  Cog6ToothIcon,
  ArrowLeftEndOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '@/stores/authStore';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const navigation = [
  { name: 'الرئيسية', href: '/dashboard', icon: HomeIcon, current: false },
  { name: 'الفصول', href: '/dashboard/classes', icon: AcademicCapIcon, current: false },
  { name: 'الطلاب', href: '/dashboard/students', icon: UserGroupIcon, current: false },
  { name: 'الاختبارات', href: '/dashboard/tests', icon: DocumentTextIcon, current: false },
  { name: 'التحضير', href: '/dashboard/lesson-plans', icon: PencilSquareIcon, current: false },
  { name: 'التقارير', href: '/dashboard/reports', icon: ChartBarIcon, current: false },
  { name: 'الألعاب', href: '/dashboard/games', icon: PuzzlePieceIcon, current: false },
  { name: 'الرسائل', href: '/dashboard/messages', icon: ChatBubbleLeftIcon, current: false },
  { name: 'الإعدادات', href: '/dashboard/settings', icon: Cog6ToothIcon, current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {/* Mobile sidebar */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="relative mr-auto flex h-full w-full max-w-xs flex-1 flex-col bg-white">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 left-0 -ml-12 pt-2">
                    <button
                      type="button"
                      className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                
                <div className="flex flex-shrink-0 items-center px-4 py-4">
                  <h1 className="text-xl font-bold text-blue-600">معلم+</h1>
                </div>
                
                <div className="h-0 flex-1 overflow-y-auto">
                  <nav className="space-y-1 px-2">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          pathname === item.href || pathname.startsWith(item.href + '/')
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-700 hover:text-blue-700 hover:bg-gray-50',
                          'group flex items-center px-2 py-2 text-base font-medium rounded-md'
                        )}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <item.icon
                          className={classNames(
                            pathname === item.href || pathname.startsWith(item.href + '/') ? 'text-blue-500' : 'text-gray-400',
                            'ml-4 flex-shrink-0 h-6 w-6'
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                </div>
                
                <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center px-2 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md"
                  >
                    <ArrowLeftEndOnRectangleIcon className="ml-3 h-5 w-5" aria-hidden="true" />
                    تسجيل الخروج
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col overflow-y-auto bg-white border-l border-gray-200">
          <div className="flex flex-shrink-0 items-center px-4 py-4">
            <h1 className="text-xl font-bold text-blue-600">معلم+</h1>
          </div>
          
          <nav className="flex-1 space-y-1 px-2 pb-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={classNames(
                  pathname === item.href || pathname.startsWith(item.href + '/')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:text-blue-700 hover:bg-gray-50',
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                )}
              >
                <item.icon
                  className={classNames(
                    pathname === item.href || pathname.startsWith(item.href + '/') ? 'text-blue-500' : 'text-gray-400',
                    'ml-3 flex-shrink-0 h-6 w-6'
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            ))}
          </nav>
          
          <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center px-2 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md"
            >
              <ArrowLeftEndOnRectangleIcon className="ml-3 h-5 w-5" aria-hidden="true" />
              تسجيل الخروج
            </button>
          </div>
        </div>
      </div>
    </>
  );
}