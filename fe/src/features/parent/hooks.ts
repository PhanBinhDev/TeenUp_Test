/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { studentApi } from '@/services/student';
import { subscriptionApi } from '@/services/subscription';
import { classRegistrationApi } from '@/services/class-registration';
import { UpdateStudentPayload } from '@/types/student';
import { RegisterClassPayload } from '@/types/class-registration';
import { toast } from 'sonner';
import { QUERY_KEYS } from '@/constants/query-key';
import { IFilterParentClassParams, IFilterStudentParams } from '@/types/base';
import useModal from '@/hooks/use-modal';
import { classApi } from '@/services/class';

export const useGetStudents = (params?: IFilterStudentParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.STUDENTS(params),
    queryFn: () => studentApi.getAll(params),
  });
};

export const useGetStudentById = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.STUDENT_DETAIL(id),
    queryFn: () => studentApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateStudent = () => {
  const queryClient = useQueryClient();
  const { closeModal } = useModal();

  return useMutation({
    mutationFn: studentApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['students'],
      });
      closeModal('ModalAddStudent');
      toast.success('Tạo học sinh thành công');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Tạo học sinh thất bại');
    },
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  const { closeModal } = useModal();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateStudentPayload;
    }) => studentApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['students'],
      });
      closeModal('ModalUpdateStudent');
      toast.success('Cập nhật học sinh thành công');
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || 'Cập nhật học sinh thất bại',
      );
    },
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  const { closeModal } = useModal();

  return useMutation({
    mutationFn: (id: string) => studentApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['students'],
      });
      closeModal('ModalRemoveStudent');
      toast.success('Xóa học sinh thành công');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Xóa học sinh thất bại');
    },
  });
};

export const useDeleteSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => subscriptionApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['subscriptions'],
      });
      toast.success('Xóa gói học thành công');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Xóa gói học thất bại');
    },
  });
};

export const useGetClassRegistrationsByStudent = (studentId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.CLASS_REGISTRATIONS(studentId),
    queryFn: () => classRegistrationApi.getByStudent(studentId),
    enabled: !!studentId,
  });
};

export const useRegisterClass = () => {
  const queryClient = useQueryClient();
  const { closeModal } = useModal();

  return useMutation({
    mutationFn: ({
      classId,
      payload,
    }: {
      classId: string;
      payload: RegisterClassPayload;
    }) => classRegistrationApi.register(classId, payload),
    onSuccess: () => {
      // Invalidate tất cả class registrations
      queryClient.invalidateQueries({
        queryKey: ['class-registrations'],
      });
      // Invalidate tất cả parent classes
      queryClient.invalidateQueries({
        queryKey: ['parent-classes'],
      });
      // Invalidate tất cả teacher classes
      queryClient.invalidateQueries({
        queryKey: ['teacher-classes'],
      });
      closeModal('ModalRegisterClass');
      toast.success('Đăng ký lớp học thành công');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Đăng ký lớp học thất bại');
    },
  });
};

export const useUnregisterClass = () => {
  const queryClient = useQueryClient();
  const { closeModal } = useModal();

  return useMutation({
    mutationFn: ({
      classId,
      studentId,
    }: {
      classId: string;
      studentId: string;
    }) => classRegistrationApi.unregister(classId, studentId),
    onSuccess: () => {
      // Invalidate tất cả class registrations
      queryClient.invalidateQueries({
        queryKey: ['class-registrations'],
      });
      // Invalidate tất cả parent classes
      queryClient.invalidateQueries({
        queryKey: ['parent-classes'],
      });
      // Invalidate tất cả teacher classes
      queryClient.invalidateQueries({
        queryKey: ['teacher-classes'],
      });
      closeModal('ModalConfirmUnregister');
      toast.success('Hủy đăng ký lớp học thành công');
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || 'Hủy đăng ký lớp học thất bại',
      );
    },
  });
};

export const useGetClassesForParent = (params?: IFilterParentClassParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.PARENT_CLASSES(params),
    queryFn: () => classApi.getAllClasses(params),
  });
};
