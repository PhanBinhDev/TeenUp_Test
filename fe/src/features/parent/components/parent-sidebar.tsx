'use client';

import {
  BookOpen,
  CalendarDays,
  CheckCircle,
  GraduationCap,
  Package,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const menuItems = [
  {
    title: 'Học sinh',
    url: '/dashboard/parent/students',
    icon: GraduationCap,
  },
  {
    title: 'Lớp học',
    url: '/dashboard/parent/classes',
    icon: BookOpen,
  },
  {
    title: 'Lớp học đã đăng ký',
    url: '/dashboard/parent/my-classes',
    icon: CheckCircle,
  },
  {
    title: 'Lịch học',
    url: '/dashboard/parent/schedule',
    icon: CalendarDays,
  },
  {
    title: 'Gói học',
    url: '/dashboard/parent/subscriptions',
    icon: Package,
  },
];

export default function ParentSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Phụ huynh</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
