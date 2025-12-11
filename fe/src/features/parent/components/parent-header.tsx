'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { LogOut } from 'lucide-react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import Hint from '@/components/shared/hint';
import { Button } from '@/components/ui/button';

export default function ParentHeader() {
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove('accessToken');
    router.push('/auth');
  };

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-semibold">Quản lý học tập</h1>
      </div>

      <Hint label="Logout">
        <Button
          variant="ghost"
          size="icon"
          className="relative ml-auto"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </Hint>
    </header>
  );
}
