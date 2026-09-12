import React from 'react';
import Image from 'next/image';
import { Award, GraduationCap, FileBadge2, Heart, CheckCircle } from 'lucide-react';

export default function AboutSpecialist() {
  const credentials = [
    {
      icon: GraduationCap,
      title: 'Tốt Nghiệp Trường Cao Đẳng Y Tế Hà Nội',
      desc: 'Đào tạo chính quy bài bản về Điều dưỡng, quy trình vệ sinh an toàn và kỹ thuật chăm sóc sơ sinh.',
    },
    {
      icon: FileBadge2,
      title: 'Chứng Chỉ Kỹ Thuật Dẫn Lưu Hệ Bạch Huyết',
      desc: 'Ứng dụng kỹ thuật dẫn lưu hệ bạch huyết kết hợp phương pháp xoa bóp truyền thống để chăm sóc nhẹ nhàng bầu ngực, thông tắc tia sữa và phục hồi sức khỏe mẹ sau sinh.',
    },
    {
      icon: Award,
      title: 'Chứng Chỉ Chăm Sóc Trẻ Sơ Sinh Và Bà Mẹ Sau Sinh',
      desc: 'Hỗ trợ chuyên sâu trong giai đoạn phục hồi và chăm sóc trẻ sơ sinh. Hướng dẫn mẹ nuôi con, theo dõi chăm sóc thể trạng bé và hỗ trợ sức khỏe mẹ toàn diện, an toàn.',
    },
  ];

  return (
    <section id="gioi-thieu" className="py-16 sm:py-20 bg-cream-200/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold-100 border border-gold-300 text-gold-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Heart className="w-3.5 h-3.5 fill-gold-600 text-gold-600" />
            <span>Về Người Sáng Lập Ngân Care</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-charcoal-900 leading-tight">
            Gặp Gỡ Chuyên Viên Điều Dưỡng <span className="gold-gradient-text">Nguyễn Thúy Ngân</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-charcoal-800">
            Hơn 9 năm tận tụy đồng hành cùng hàng nghìn mẹ bỉm sữa Thủ đô bằng sự thấu cảm của một người mẹ và tác phong chuyên nghiệp, tận tâm.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Portrait Column with Luxury Gold Ring */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative">
              {/* Outer Golden Ring / Glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-gold-500 via-amber-300 to-gold-600 blur-lg opacity-40 scale-105 animate-pulse-subtle" />
              
              {/* Portrait Container */}
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full p-2 bg-gradient-to-tr from-gold-500 via-amber-200 to-gold-600 shadow-2xl">
                <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white">
                  <Image
                    src="/images/avata.jpg"
                    alt="Chân dung Điều Dưỡng Nguyễn Thúy Ngân"
                    fill
                    className="object-cover scale-105 hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* Experience Badge */}
              <div className="absolute -bottom-2 right-4 sm:right-8 bg-charcoal-900 text-white px-4 py-2 rounded-2xl shadow-xl border-2 border-gold-400 flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black text-gold-400">9+</span>
                <span className="text-[11px] sm:text-xs font-semibold leading-tight">Năm Kinh Nghiệm<br/>Tận Tâm</span>
              </div>
            </div>
          </div>

          {/* Details & Qualifications Column */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Quote Box */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border-l-4 border-gold-500 shadow-sm">
              <p className="text-sm sm:text-base text-charcoal-900 italic font-medium leading-relaxed">
                “Mỗi em bé chào đời là một thiên thần vô giá. Người mẹ sau cuộc vượt cạn thiêng liêng xứng đáng được nâng niu, chăm sóc bằng tất cả tình yêu thương và sự chu đáo, tận tâm nhất.”
              </p>
              <p className="text-right text-xs font-bold text-gold-700 mt-2">
                — Điều Dưỡng Nguyễn Thúy Ngân
              </p>
            </div>

            {/* List of Qualifications */}
            <div className="space-y-4">
              {credentials.map((cred, idx) => {
                const Icon = cred.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white p-4 sm:p-5 rounded-xl border border-gold-200/80 shadow-sm flex items-start gap-4 hover:border-gold-400 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gold-100 flex items-center justify-center text-gold-600 flex-shrink-0 mt-0.5">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-charcoal-900">{cred.title}</h4>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">{cred.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
