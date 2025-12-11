'use client';

import { Suspense, useEffect, useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AuthHeader,
  LoginForm,
  RegisterForm,
} from '@/features/auth/components';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import { getDashboardPath } from '@/lib/utils';
import { UserRole } from '@/types/enum';

type AuthType = 'login' | 'register';

const AuthContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [authType, setAuthType] = useState<AuthType>('login');
  const tabParam = searchParams.get('tab') as AuthType | null;
  const redirectParam = searchParams.get('redirect') || undefined;

  useEffect(() => {
    if (tabParam === 'login' || tabParam === 'register') {
      setAuthType(tabParam);
    }
  }, [tabParam]);

  useEffect(() => {
    const token = Cookies.get('accessToken');
    let userRole: UserRole | undefined;

    try {
      const userCookie = Cookies.get('user');
      if (userCookie) {
        userRole = JSON.parse(userCookie).role as UserRole | undefined;
      }
    } catch (error) {
      console.error('Invalid user cookie:', error);
    }

    if (token && userRole) {
      const destination = redirectParam || getDashboardPath(userRole);
      router.replace(destination);
    }
  }, [router, redirectParam]);

  return (
    <Card className="w-full max-w-md border-0 bg-white/80 shadow-xl backdrop-blur-sm">
      <AuthHeader />

      <CardContent className="pb-4">
        <Tabs
          value={authType}
          onValueChange={value => setAuthType(value as AuthType)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 bg-slate-100/80 p-1">
            <TabsTrigger
              value="login"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              Đăng nhập
            </TabsTrigger>
            <TabsTrigger
              value="register"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              Đăng ký
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-4">
            <LoginForm />
          </TabsContent>

          <TabsContent value="register" className="mt-4">
            <RegisterForm />
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="flex flex-col space-y-2 pb-4 text-center text-xs text-slate-500">
        <p>
          Bằng cách đăng nhập, bạn đồng ý với{' '}
          <a
            href="#"
            className="font-medium text-blue-600 underline hover:text-blue-700"
          >
            Điều khoản sử dụng
          </a>
        </p>
      </CardFooter>
    </Card>
  );
};

const AuthPage = () => {
  return (
    <Suspense
      fallback={
        <Card className="w-full max-w-md border-0 bg-white/80 shadow-xl backdrop-blur-sm">
          <div className="flex items-center justify-center p-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          </div>
        </Card>
      }
    >
      <AuthContent />
    </Suspense>
  );
};

export default AuthPage;
