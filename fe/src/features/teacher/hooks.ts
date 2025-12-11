import { QUERY_KEYS } from '@/constants/query-key';
import useModal from '@/hooks/use-modal';
import { attendanceApi } from '@/services/attendance';
import { classApi } from '@/services/class';
import { teacherApi } from '@/services/teacher';
import { IFilterClassParams } from '@/types/base';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const useGetClassesForTeacher = (filter: IFilterClassParams) => {
  return useQuery({
    queryFn: () => classApi.getAllClasses(filter),
    queryKey: QUERY_KEYS.TEACHER_CLASSES(filter),
  });
};

export const useGetClassByIdForTeacher = (id: string) => {
  return useQuery({
    queryFn: () => classApi.getClassById(id),
    queryKey: QUERY_KEYS.TEACHER_CLASSES({ id }),
    enabled: !!id,
  });
};

export const useCreateClassForTeacher = () => {
  const queryClient = useQueryClient();
  const { closeModal } = useModal();
  const router = useRouter();

  return useMutation({
    mutationFn: classApi.createClass,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.TEACHER_CLASSES({}),
      });
      closeModal('ModalAddClass');
      toast.success('Tạo lớp học thành công!');
      router.push('/dashboard/teacher/classes');
    },
    onError: () => {
      toast.error('Tạo lớp học thất bại. Vui lòng thử lại.');
    },
  });
};

export const useDeleteClassForTeacher = () => {
  const queryClient = useQueryClient();
  const { closeModal } = useModal();

  return useMutation({
    mutationFn: classApi.deleteClass,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.TEACHER_CLASSES({}),
      });
      closeModal('ModalRemoveClass');
      toast.success('Xóa lớp học thành công!');
    },
    onError: () => {
      toast.error('Xóa lớp học thất bại. Vui lòng thử lại.');
    },
  });
};

export const useChangeClassStatus = () => {
  const queryClient = useQueryClient();
  const { closeModal } = useModal();

  return useMutation({
    mutationFn: classApi.changeClassStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.TEACHER_CLASSES({}),
      });
      closeModal('ModalChangeClassStatus');
      toast.success('Cập nhật trạng thái lớp học thành công!');
    },
    onError: () => {
      toast.error('Cập nhật trạng thái lớp học thất bại. Vui lòng thử lại.');
    },
  });
};

export const useUpdateClassForTeacher = () => {
  const queryClient = useQueryClient();
  const { closeModal } = useModal();

  return useMutation({
    mutationFn: classApi.updateClass,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.TEACHER_CLASSES({}),
      });
      closeModal('ModalUpdateClass');
      toast.success('Cập nhật lớp học thành công!');
    },
    onError: () => {
      toast.error('Cập nhật lớp học thất bại. Vui lòng thử lại.');
    },
  });
};

export const useGetTeacherStatistics = () => {
  return useQuery({
    queryFn: () => teacherApi.getStatistics(),
    queryKey: ['teacher-statistics'],
  });
};

export const useGetTodaySchedule = () => {
  return useQuery({
    queryFn: () => teacherApi.getTodaySchedule(),
    queryKey: ['teacher-today-schedule'],
  });
};

export const useGetAttendance = (classId: string, attendanceDate: string) => {
  return useQuery({
    queryFn: () => attendanceApi.getAttendance({ classId, attendanceDate }),
    queryKey: ['teacher-attendance', classId, attendanceDate],
    enabled: !!classId && !!attendanceDate,
  });
};

export const useMarkAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: attendanceApi.markAttendance,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['teacher-attendance'],
      });
      toast.success('Điểm danh thành công!');
    },
    onError: () => {
      toast.error('Điểm danh thất bại. Vui lòng thử lại.');
    },
  });
};

export const useUpdateTeacherProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: teacherApi.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['me'],
      });
      toast.success('Cập nhật thông tin thành công!');
    },
    onError: () => {
      toast.error('Cập nhật thất bại. Vui lòng thử lại.');
    },
  });
};
