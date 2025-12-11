'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User, Mail, Phone, MapPin, Briefcase, Award } from 'lucide-react';
import { useGetMe } from '@/features/auth/hooks';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { useUpdateTeacherProfile } from '@/features/teacher/hooks';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  TeacherProfileFormData,
  teacherProfileSchema,
} from '@/lib/validations/teacher';

export default function TeacherSettingsPage() {
  const { data: userData, isLoading } = useGetMe();
  const [isEditing, setIsEditing] = useState(false);
  const { mutate: updateProfile, isPending } = useUpdateTeacherProfile();

  const teacher = userData?.data?.teacher;

  const form = useForm<TeacherProfileFormData>({
    resolver: zodResolver(teacherProfileSchema),
    values: {
      fullName: userData?.data?.fullName || '',
      phone: userData?.data?.phone || '',
      address: userData?.data?.address || '',
      specialization: teacher?.specialization || '',
      yearsOfExperience: teacher?.yearsOfExperience || 0,
      bio: teacher?.bio || '',
    },
  });

  const onSubmit = (data: TeacherProfileFormData) => {
    updateProfile(data, {
      onSuccess: () => {
        setIsEditing(false);
      },
    });
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Cài đặt</h2>
        <p className="text-muted-foreground text-sm">
          Quản lý thông tin cá nhân và tài khoản
        </p>
      </div>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin cá nhân</CardTitle>
          <CardDescription>
            Cập nhật thông tin cá nhân và liên hệ của bạn
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Họ và tên</Label>
                  <div className="relative">
                    <User className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                    <Input
                      id="fullName"
                      {...form.register('fullName')}
                      disabled={!isEditing}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                    <Input
                      id="email"
                      type="email"
                      defaultValue={userData?.data?.email}
                      disabled
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <div className="relative">
                    <Phone className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                    <Input
                      id="phone"
                      {...form.register('phone')}
                      disabled={!isEditing}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Địa chỉ</Label>
                  <div className="relative">
                    <MapPin className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                    <Input
                      id="address"
                      {...form.register('address')}
                      disabled={!isEditing}
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Thông tin giảng dạy</h3>

                <div className="space-y-2">
                  <Label htmlFor="specialization">Chuyên môn</Label>
                  <div className="relative">
                    <Briefcase className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                    <Input
                      id="specialization"
                      {...form.register('specialization')}
                      disabled={!isEditing}
                      placeholder="VD: Toán học, Vật lý..."
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="yearsOfExperience">Số năm kinh nghiệm</Label>
                  <div className="relative">
                    <Award className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                    <Input
                      id="yearsOfExperience"
                      type="number"
                      {...form.register('yearsOfExperience', {
                        valueAsNumber: true,
                      })}
                      disabled={!isEditing}
                      placeholder="VD: 5"
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Giới thiệu bản thân</Label>
                  <Textarea
                    id="bio"
                    {...form.register('bio')}
                    disabled={!isEditing}
                    placeholder="Giới thiệu ngắn gọn về bản thân, kinh nghiệm và phương pháp giảng dạy..."
                    rows={4}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                {isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        form.reset();
                      }}
                      disabled={isPending}
                    >
                      Hủy
                    </Button>
                    <Button
                      onClick={form.handleSubmit(onSubmit)}
                      disabled={isPending}
                      loading={isPending}
                    >
                      Lưu thay đổi
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>Chỉnh sửa</Button>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
