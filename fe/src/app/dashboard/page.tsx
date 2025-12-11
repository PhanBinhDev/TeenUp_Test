import { requiredAuth } from '@/actions/required-auth';
import { getDashboardPath } from '@/lib/utils';
import { redirect } from 'next/navigation';

const DashboardLayout = async () => {
  const user = await requiredAuth();
  if (!user) redirect('/auth?redirect=/dashboard');

  const correctDashboard = getDashboardPath(user.role);
  redirect(correctDashboard);
};

export default DashboardLayout;
