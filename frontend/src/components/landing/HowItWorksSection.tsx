import React from "react";

const steps = [
  {
    number: "1",
    title: "انشئ حسابك المجاني",
    description: "سجل بياناتك الأساسية واختر نوع المدرسة والمواد التي تدرسها",
    icon: "👤",
    color: "bg-blue-100 text-primary"
  },
  {
    number: "2", 
    title: "أضف فصولك وطلابك",
    description: "قم بإضافة بيانات الفصول والطلاب أو استيراد البيانات من ملف Excel",
    icon: "📚",
    color: "bg-yellow-100 text-secondary"
  },
  {
    number: "3",
    title: "ابدأ التدريس بفعالية",
    description: "استخدم جميع الأدوات المتاحة لجعل التدريس أكثر متعة وفعالية",
    icon: "🚀",
    color: "bg-green-100 text-green-600"
  }
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-12 sm:py-16 lg:py-20 bg-neutral">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            كيف يعمل <span className="text-primary">معلم+</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
            ابدأ رحلتك مع معلم+ في ثلاث خطوات بسيطة وسهلة
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              {/* Step Number and Icon */}
              <div className="relative mb-8">
                <div className={`w-24 h-24 ${step.color} rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold shadow-lg`}>
                  {step.number}
                </div>
                <div className="text-4xl mb-4">
                  {step.icon}
                </div>
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-full w-12 h-0.5 bg-gradient-to-r from-gray-300 to-transparent"></div>
                )}
              </div>

              {/* Step Content */}
              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Time Saving */}
          <div className="bg-white rounded-xl p-8 shadow-md">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center ml-4">
                <span className="text-2xl">⏱️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                وفر ساعات من وقتك أسبوعياً
              </h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              يساعدك معلم+ على توفير أكثر من 10 ساعات أسبوعياً من خلال أتمتة المهام الروتينية وتوفير أدوات ذكية للتحضير والتقييم.
            </p>
          </div>

          {/* Right Column - Support */}
          <div className="bg-white rounded-xl p-8 shadow-md">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center ml-4">
                <span className="text-2xl">🆘</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                دعم فني متخصص
              </h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              فريق الدعم الفني متاح لمساعدتك في أي وقت، مع تدريب مجاني وموارد تعليمية شاملة لضمان استفادتك الكاملة من المنصة.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="inline-block bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              مستعد للبدء؟
            </h3>
            <p className="text-gray-600 mb-6">
              انضم إلى آلاف المعلمين الذين يستخدمون معلم+ بنجاح
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors duration-200">
                ابدأ الآن مجاناً
              </button>
              <button className="border-2 border-primary text-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors duration-200">
                شاهد العرض التوضيحي
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;