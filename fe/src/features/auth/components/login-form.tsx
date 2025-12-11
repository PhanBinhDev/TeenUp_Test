'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '@/lib/validations/auth';
import { Mail, Lock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLogin } from '@/features/auth/hooks';

export const LoginForm = () => {
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { mutate: loginMutation, isError, isPending } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginForm.handleSubmit(onSubmit)();
  };

  const onSubmit = (data: LoginFormData) => {
    loginMutation(data);
  };

  return (
    <Form {...loginForm}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <FormField
          control={loginForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-slate-700">
                Email
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    type="email"
                    placeholder="email@example.com"
                    className="h-10 border-slate-200 bg-white pl-10 focus:border-blue-500 focus:ring-blue-500"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={loginForm.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-slate-700">
                Mật khẩu
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="h-10 border-slate-200 bg-white pl-10 focus:border-blue-500 focus:ring-blue-500"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {isError && (
          <Alert
            variant="destructive"
            className="border-red-200 bg-red-50 py-2"
          >
            <AlertDescription className="text-xs">
              Email hoặc mật khẩu không đúng. Vui lòng thử lại.
            </AlertDescription>
          </Alert>
        )}

        <Button
          type="submit"
          className="h-10 w-full bg-gradient-to-r from-blue-600 to-indigo-600 font-medium text-white shadow-md transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg"
          disabled={isPending}
          loading={isPending}
        >
          Đăng nhập
        </Button>
      </form>
    </Form>
  );
};
