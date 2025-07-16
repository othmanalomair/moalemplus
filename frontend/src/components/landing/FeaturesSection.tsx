import React from "react";

const features = [
  {
    icon: "📝",
    title: "أداة إنشاء الاختبارات",
    description: "بنك أسئلة ضخم مصنف حسب المنهج الكويتي مع إمكانية إضافة أسئلة شخصية والحصول على الإجابة النموذجية",
    highlights: ["اختبارات قصيرة وطويلة", "بنك أسئلة مصنف", "إجابات نموذجية"]
  },
  {
    icon: "🎯",
    title: "متابعة الطلاب داخل الفصل",
    description: "أدوات تفاعلية متقدمة لإدارة الفصل بفعالية وجعل التعلم أكثر تشويقاً",
    highlights: ["عجلة الحظ للطلاب", "مؤقتات متعددة", "إشارات مرورية للضوضاء"]
  },
  {
    icon: "📊",
    title: "متابعة الطلاب خارج الفصل",
    description: "نظام شامل لمتابعة أداء الطلاب والتواصل مع أولياء الأمور بما يتوافق مع النظام الكويتي",
    highlights: ["سجل الدرجات", "التواصل مع الأهل", "ملف الطالب الشامل"]
  },
  {
    icon: "📋",
    title: "أداة التحضير للدروس",
    description: "قوالب تحضير معتمدة من الوزارة مع مكتبة شاملة من الخطط الدرسية القابلة لإعادة الاستخدام",
    highlights: ["قوالب معتمدة", "مكتبة خطط", "إعادة استخدام"]
  },
  {
    icon: "🎥",
    title: "العروض التقديمية التفاعلية",
    description: "منشئ عروض تقديمية متقدم مع دعم كامل للعربية وأدوات تفاعلية متنوعة",
    highlights: ["قوالب جاهزة", "أدوات تفاعلية", "تصدير متعدد الصيغ"]
  },
  {
    icon: "🎮",
    title: "الألعاب التعليمية التفاعلية",
    description: "مجموعة متنوعة من الألعاب التعليمية التي تجعل التعلم ممتعاً وتفاعلياً",
    highlights: ["المسابقة الكبرى", "عجلة الأسئلة", "سباق الفرق"]
  }
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            مميزات <span className="text-primary">معلم+</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
            أدوات شاملة ومتقدمة مصممة خصيصاً لتلبية احتياجات المعلمين في دولة الكويت
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-neutral rounded-xl p-6 sm:p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
            >
              {/* Icon */}
              <div className="text-4xl sm:text-5xl mb-4 sm:mb-6 text-center">
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 text-center">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed text-center">
                {feature.description}
              </p>

              {/* Highlights */}
              <div className="space-y-2">
                {feature.highlights.map((highlight, highlightIndex) => (
                  <div
                    key={highlightIndex}
                    className="flex items-center text-sm text-gray-700"
                  >
                    <div className="w-2 h-2 bg-secondary rounded-full mr-3 flex-shrink-0"></div>
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <div className="mt-6 text-center">
                <button className="text-primary hover:text-primary/80 font-medium text-sm transition-colors duration-200">
                  اعرف المزيد ←
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              جرب جميع المميزات مجاناً لمدة 30 يوم
            </h3>
            <p className="text-blue-100 mb-6">
              بدون التزام، بدون رسوم، مع إمكانية الإلغاء في أي وقت
            </p>
            <button className="bg-secondary text-primary px-8 py-3 rounded-lg font-semibold hover:bg-secondary/90 transition-colors duration-200">
              ابدأ التجربة المجانية الآن
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;