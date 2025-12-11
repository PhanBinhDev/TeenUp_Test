import { BookOpen } from 'lucide-react';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const AuthHeader = () => {
  return (
    <CardHeader className="space-y-2 pb-4 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg ring-4 ring-blue-100">
        <BookOpen className="h-6 w-6 text-white" />
      </div>
      <div className="space-y-1">
        <CardTitle className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-xl font-bold text-transparent">
          TeenUp Learning
        </CardTitle>
        <CardDescription className="text-xs text-slate-600">
          Nền tảng quản lý học sinh hiện đại
        </CardDescription>
      </div>
    </CardHeader>
  );
};
