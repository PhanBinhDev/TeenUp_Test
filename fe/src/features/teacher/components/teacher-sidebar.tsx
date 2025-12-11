'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  Settings,
  GraduationCap,
  LogOut,
  ChevronUp,
} from 'lucide-react';
import { useGetMe } from '@/features/auth/hooks';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const menuItems = [
  {
    title: 'Dashboard',
    href: '/dashboard/teacher',
    icon: LayoutDashboard,
  },
  {
    title: 'Lớp học của tôi',
    href: '/dashboard/teacher/classes',
    icon: BookOpen,
  },
  {
    title: 'Điểm danh',
    href: '/dashboard/teacher/attendance',
    icon: ClipboardList,
  },
  {
    title: 'Cài đặt',
    href: '/dashboard/teacher/settings',
    icon: Settings,
  },
];

export function TeacherSidebar() {
  const { data: userData } = useGetMe();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove('accessToken');
    router.push('/auth');
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard/teacher">
                <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GraduationCap className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">TeenUp LMS</span>
                  <span className="truncate text-xs">Teacher Portal</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu chính</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map(item => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      size="default"
                    >
                      <Link href={item.href}>
                        <Icon size={14} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <span className="text-sm font-medium">
                      {userData?.data?.fullName?.charAt(0).toUpperCase() || 'T'}
                    </span>
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {userData?.data?.fullName || 'Teacher'}
                    </span>
                    <span className="truncate text-xs">Giáo viên</span>
                  </div>
                  <ChevronUp className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="top"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem asChild disabled>
                  <Link href="/dashboard/teacher/settings">
                    <Settings className="mr-2 size-4" />
                    <span>Cài đặt</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <button className="w-full" onClick={handleLogout}>
                    <LogOut className="mr-2 size-4" />
                    <span>Đăng xuất</span>
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
