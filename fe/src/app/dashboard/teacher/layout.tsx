import { requiredAuth } from '@/actions/required-auth';
import { getDashboardPath } from '@/lib/utils';
import { redirect } from 'next/navigation';
import { UserRole } from '@/types/enum';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { TeacherSidebar } from '../../../features/teacher/components/teacher-sidebar';
import { TeacherHeader } from '../../../features/teacher/components/teacher-header';

const TeacherLayout = async ({ children }: IChildren) => {
  const user = await requiredAuth();

  if (!user) {
    redirect('/auth?redirect=/dashboard');
  }

  if (user.role !== UserRole.TEACHER) {
    const correctDashboard = getDashboardPath(user.role);
    redirect(correctDashboard);
  }

  return (
    <SidebarProvider>
      <TeacherSidebar />
      <SidebarInset>
        <TeacherHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default TeacherLayout;
