/* eslint-disable @typescript-eslint/no-explicit-any */
import { QUERY_KEYS } from '@/constants/query-key';
import { subscriptionApi } from '@/services/subscription';
import { IFilterSubscriptionParams } from '@/types/base';
import { UpdateSubscriptionPayload } from '@/types/subscription';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useGetSubscriptions = (params?: IFilterSubscriptionParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.SUBSCRIPTIONS(params),
    queryFn: () => subscriptionApi.getAll(params),
  });
};

export const useGetSubscriptionById = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.SUBSCRIPTION_DETAIL(id),
    queryFn: () => subscriptionApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: subscriptionApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['subscriptions'],
        exact: false,
      });
      toast.success('Tạo gói học thành công');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Tạo gói học thất bại');
    },
  });
};

export const useUpdateSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateSubscriptionPayload;
    }) => subscriptionApi.update(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SUBSCRIPTIONS(),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SUBSCRIPTION_DETAIL(variables.id),
      });
      toast.success('Cập nhật gói học thành công');
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || 'Cập nhật gói học thất bại',
      );
    },
  });
};

export const useUseSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => subscriptionApi.useSession(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SUBSCRIPTIONS(),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SUBSCRIPTION_DETAIL(id),
      });
      toast.success('Sử dụng buổi học thành công');
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || 'Sử dụng buổi học thất bại',
      );
    },
  });
};
