import React from 'react';
import { GraduationCap, PackageCheck, CircleDollarSign, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function Commitments3No() {
  const commitments = [
    {
      icon: GraduationCap,
      title: 'Kiến thức chăm sóc sức khoẻ mẹ và bé được đào tạo chính quy từ các trường y thuộc Bộ Giáo dục và Bộ Y tế',
      desc: 'Đảm bảo tính khoa học và cập nhật kiến thức theo tiêu chuẩn y tế hiện đại, không suy diễn, đoán mò mà luôn dựa trên nền tảng y học chứng cứ.',
      tag: 'Đào Tạo Chính Quy',
    },
    {
      icon: PackageCheck,
      title: 'Sản phẩm sử dụng rõ nguồn gốc xuất xứ',
      desc: 'Mỗi sản phẩm sử dụng trong quá trình chăm sóc đều có rõ nguồn gốc xuất xứ và được công khai với khách hàng. Cam kết không sử dụng những sản phẩm không rõ chất lượng hay có dấu hiệu giả mạo, làm ảnh hưởng đến sức khoẻ của mẹ và bé.',
      tag: 'Minh Bạch Xuất Xứ',
    },
    {
      icon: CircleDollarSign,
      title: 'Không tự ý phát sinh thêm chi phí, phụ phí ngoài lề',
      desc: 'Giá dịch vụ được công bố rõ ràng từ đầu, không tự ý thu bất kỳ phụ phí hay chi phí ngoài lề nào trong quá trình chăm sóc. Các mẹ biết rõ mình sẽ chi bao nhiêu, không lo bị động hay bất ngờ khi thanh toán.',
      tag: 'Giá Cả Rõ Ràng',
    },
  ];

  return (
    <section id="cam-ket" className="py-16 sm:py-20 bg-gradient-to-b from-amber-50/50 via-white to-cream-100 text-charcoal-900 relative overflow-hidden">
      {/* Subtle gold glow behind */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gold-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gold-100 border border-gold-300 text-gold-800 text-xs font-bold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-4 h-4 text-gold-600" />
            <span>Danh Dự Nghề Y</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-charcoal-900">
            Cam Kết Vàng Từ <span className="gold-gradient-text">Điều Dưỡng Thúy Ngân</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-charcoal-800">
            Đặt sự an toàn của mẹ và bé lên trên hết — Sự an tâm của gia đình là tôn chỉ hoạt động cao nhất.
          </p>
        </div>

        {/* 3 Commitments Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {commitments.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-white border border-amber-200 rounded-3xl p-7 hover:border-gold-400 transition-all duration-300 flex flex-col justify-between group shadow-sm hover:shadow-gold-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-gold-700 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gold-800 bg-gold-100 px-3 py-1 rounded-full border border-gold-200">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-charcoal-900 leading-snug mb-3">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-charcoal-800 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-amber-100 flex items-center gap-2 text-xs text-gold-700 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Bảo đảm bằng uy tín thương hiệu</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
