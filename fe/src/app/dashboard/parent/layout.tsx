import { requiredAuth } from '@/actions/required-auth';
import { getDashboardPath } from '@/lib/utils';
import { redirect } from 'next/navigation';
import { UserRole } from '@/types/enum';
import ParentSidebar from '@/features/parent/components/parent-sidebar';
import ParentHeader from '@/features/parent/components/parent-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

const ParentLayout = async ({ children }: IChildren) => {
  const user = await requiredAuth();

  if (!user) {
    redirect('/auth?redirect=/dashboard');
  }

  if (user.role !== UserRole.PARENT) {
    const correctDashboard = getDashboardPath(user.role);
    redirect(correctDashboard);
  }

  return (
    <SidebarProvider>
      <ParentSidebar />
      <SidebarInset>
        <ParentHeader />
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default ParentLayout;
