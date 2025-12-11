'use client';

import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import Hint from '@/components/shared/hint';

export function TeacherHeader() {
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove('accessToken');
    router.push('/auth');
  };

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <div className="flex flex-1 items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Dashboard</h1>
          <p className="text-muted-foreground hidden text-sm sm:block">
            {new Date().toLocaleDateString('vi-VN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <Hint label="Logout">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </Hint>
      </div>
    </header>
  );
}
