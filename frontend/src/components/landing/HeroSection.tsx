import React from "react";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-primary to-primary/80 text-white py-16 sm:py-20 lg:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%227%22%20cy%3D%227%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
            مرحباً بك في{" "}
            <span className="text-secondary">معلم+</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed px-4">
            منصة تعليمية شاملة مصممة خصيصاً للمعلمين في دولة الكويت
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            لتسهيل عملية التدريس وإدارة الفصول بأدوات حديثة وسهلة الاستخدام
          </p>

          {/* Features highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12 max-w-4xl mx-auto px-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-6">
              <div className="text-secondary text-2xl sm:text-3xl mb-2 sm:mb-3">📝</div>
              <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">إنشاء الاختبارات</h3>
              <p className="text-blue-100 text-xs sm:text-sm">بنك أسئلة ضخم مصنف حسب المنهج الكويتي</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-6">
              <div className="text-secondary text-2xl sm:text-3xl mb-2 sm:mb-3">🎯</div>
              <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">متابعة الطلاب</h3>
              <p className="text-blue-100 text-xs sm:text-sm">أدوات تفاعلية لمتابعة الطلاب داخل وخارج الفصل</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-6">
              <div className="text-secondary text-2xl sm:text-3xl mb-2 sm:mb-3">🎮</div>
              <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">ألعاب تعليمية</h3>
              <p className="text-blue-100 text-xs sm:text-sm">ألعاب تفاعلية تجعل التعلم أكثر متعة</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
            <Link
              href="/register"
              className="bg-secondary text-primary px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-secondary/90 transition-all duration-200 transform hover:scale-105 shadow-lg w-full sm:w-auto text-center"
            >
              ابدأ التجربة المجانية
            </Link>
            <Link
              href="#features"
              className="border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-white hover:text-primary transition-all duration-200 w-full sm:w-auto text-center"
            >
              اكتشف المميزات
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 text-center">
            <p className="text-blue-200 text-sm mb-4">يثق بنا أكثر من 1000+ معلم في الكويت</p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 opacity-60">
              <div className="text-xs">✓ متوافق مع وزارة التربية</div>
              <div className="text-xs">✓ أمان وخصوصية البيانات</div>
              <div className="text-xs">✓ دعم فني على مدار الساعة</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-white/60"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;