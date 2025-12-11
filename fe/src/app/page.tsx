import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  Users,
  Calendar,
  Award,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';

export default async function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-slate-900">TeenUp</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/auth?tab=login">
              <Button variant="ghost">Đăng nhập</Button>
            </Link>
            <Link href="/auth?tab=register">
              <Button>Đăng ký ngay</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-6 text-5xl leading-tight font-bold text-slate-900 md:text-6xl">
            Nền tảng quản lý{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              giáo dục
            </span>{' '}
            hiện đại
          </h1>
          <p className="mb-8 text-xl text-slate-600">
            Giải pháp toàn diện cho việc quản lý lớp học, điểm danh, và theo dõi
            tiến độ học tập của học sinh
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/auth?tab=register">
              <Button size="lg" className="w-full sm:w-auto">
                Bắt đầu miễn phí
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/auth?tab=login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Tìm hiểu thêm
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-slate-900">
            Tính năng nổi bật
          </h2>
          <p className="text-lg text-slate-600">
            Mọi thứ bạn cần để quản lý trung tâm giáo dục hiệu quả
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon={<Calendar className="h-8 w-8 text-blue-600" />}
            title="Quản lý lớp học"
            description="Tạo và quản lý lịch học, thời khóa biểu linh hoạt cho nhiều lớp"
          />
          <FeatureCard
            icon={<CheckCircle2 className="h-8 w-8 text-green-600" />}
            title="Điểm danh thông minh"
            description="Điểm danh nhanh chóng với giao diện trực quan, theo dõi tình trạng học sinh"
          />
          <FeatureCard
            icon={<Users className="h-8 w-8 text-purple-600" />}
            title="Quản lý học viên"
            description="Theo dõi thông tin học sinh, phụ huynh và lịch sử học tập"
          />
          <FeatureCard
            icon={<Award className="h-8 w-8 text-orange-600" />}
            title="Gói học linh hoạt"
            description="Quản lý các gói học, subscription và số buổi học còn lại"
          />
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white/50 py-20">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold text-slate-900">
                Tại sao chọn TeenUp?
              </h2>
              <div className="space-y-4">
                <BenefitItem text="Giao diện thân thiện, dễ sử dụng" />
                <BenefitItem text="Tiết kiệm thời gian quản lý hành chính" />
                <BenefitItem text="Báo cáo và thống kê chi tiết" />
                <BenefitItem text="Hỗ trợ đa vai trò: giáo viên, phụ huynh, quản lý" />
                <BenefitItem text="Bảo mật thông tin tuyệt đối" />
                <BenefitItem text="Cập nhật và hỗ trợ liên tục" />
              </div>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 p-12">
              <div className="space-y-6 text-center">
                <div>
                  <div className="mb-2 text-5xl font-bold text-blue-600">
                    1000+
                  </div>
                  <div className="text-slate-600">Học sinh đang học</div>
                </div>
                <div>
                  <div className="mb-2 text-5xl font-bold text-indigo-600">
                    50+
                  </div>
                  <div className="text-slate-600">Giáo viên tin dùng</div>
                </div>
                <div>
                  <div className="mb-2 text-5xl font-bold text-purple-600">
                    100+
                  </div>
                  <div className="text-slate-600">Lớp học hoạt động</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-6 text-4xl font-bold text-slate-900">
            Sẵn sàng bắt đầu?
          </h2>
          <p className="mb-8 text-lg text-slate-600">
            Tham gia cùng hàng trăm trung tâm giáo dục đang sử dụng TeenUp để
            quản lý hiệu quả hơn
          </p>
          <Link href="/auth?tab=register">
            <Button size="lg" className="px-8">
              Đăng ký miễn phí ngay
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-slate-900 py-8 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <BookOpen className="h-6 w-6" />
            <span className="text-lg font-bold">TeenUp</span>
          </div>
          <p className="text-sm text-slate-400">
            © 2025 TeenUp. Nền tảng quản lý giáo dục hiện đại.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-4">{icon}</div>
      <h3 className="mb-2 text-xl font-semibold text-slate-900">{title}</h3>
      <p className="text-slate-600">{description}</p>
    </div>
  );
}

function BenefitItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-green-600" />
      <span className="text-slate-700">{text}</span>
    </div>
  );
}
