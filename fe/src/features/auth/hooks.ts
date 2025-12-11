/* eslint-disable @typescript-eslint/no-explicit-any */
import { QUERY_KEYS } from '@/constants/query-key';
import { authApi } from '@/services/auth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import { getDashboardPath } from '@/lib/utils';

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: response => {
      if (response?.data?.accessToken) {
        const cookieOptions = {
          expires: 7,
          sameSite: 'lax' as const,
          path: '/',
          secure: process.env.NODE_ENV === 'production',
        };

        Cookies.set('accessToken', response.data.accessToken, cookieOptions);
        Cookies.set('user', JSON.stringify(response.data.user), cookieOptions);
      }

      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH_ME });

      toast.success('Đăng nhập thành công!');
      router.push(getDashboardPath(response.data.user.role));
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Đăng nhập thất bại');
    },
  });
};

export const useRegister = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: response => {
      if (response?.data?.accessToken) {
        const cookieOptions = {
          expires: 7,
          sameSite: 'lax' as const,
          path: '/',
          secure: process.env.NODE_ENV === 'production',
        };

        Cookies.set('accessToken', response.data.accessToken, cookieOptions);
        Cookies.set('user', JSON.stringify(response.data.user), cookieOptions);

        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH_ME });
        toast.success('Đăng ký thành công!');
        router.push(getDashboardPath(response.data.user.role));
      } else {
        toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
        router.push('/auth?tab=login');
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Đăng ký thất bại');
    },
  });
};

export const useGetMe = () => {
  const hasToken =
    typeof window !== 'undefined' ? !!Cookies.get('accessToken') : false;

  return useQuery({
    queryFn: authApi.getMe,
    enabled: hasToken,
    queryKey: QUERY_KEYS.AUTH_ME,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
};

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      Cookies.remove('accessToken', { path: '/' });
      Cookies.remove('user', { path: '/' });

      queryClient.clear();

      toast.success('Đăng xuất thành công!');
      router.push('/auth');
    },
    onError: (error: any) => {
      Cookies.remove('accessToken', { path: '/' });
      Cookies.remove('user', { path: '/' });
      queryClient.clear();
      toast.error(error?.response?.data?.message || 'Đăng xuất thất bại');
      router.push('/auth');
    },
  });
};
