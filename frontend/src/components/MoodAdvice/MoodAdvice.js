import React from 'react';
import './MoodAdvice.css';

const MoodAdvice = ({ mood, onActivitySelect }) => {
  const adviceData = {
    happy: {
      emoji: '😊',
      color: '#34d399',
      title: 'أنت سعيد اليوم!',
      message: 'استمتع بهذا الشعور الرائع واستثمره في أنشطة إيجابية',
      activities: [
        {
          icon: '🎨',
          title: 'ارسم أو لوّن',
          description: 'عبّر عن سعادتك بالألوان',
          action: 'draw',
        },
        {
          icon: '🎵',
          title: 'استمع للموسيقى',
          description: 'استمتع بأغانيك المفضلة',
          action: 'music',
        },
        {
          icon: '📖',
          title: 'اقرأ قصة ممتعة',
          description: 'استمتع بقراءة قصة مسلية',
          action: 'story',
        },
        {
          icon: '🤸',
          title: 'العب وتحرك',
          description: 'اخرج طاقتك الإيجابية',
          action: 'exercise',
        },
      ],
      tips: [
        'شارك سعادتك مع من حولك',
        'سجّل لحظاتك السعيدة في يومياتك',
        'افعل شيئاً طيباً لشخص آخر',
      ],
    },
    sad: {
      emoji: '😢',
      color: '#60a5fa',
      title: 'تبدو حزيناً',
      message: 'لا بأس بأن تشعر بالحزن أحياناً، سنساعدك على الشعور بتحسن',
      activities: [
        {
          icon: '🫂',
          title: 'تحدث مع شخص قريب',
          description: 'شارك مشاعرك مع شخص تثق به',
          action: 'talk',
        },
        {
          icon: '🧘',
          title: 'تمرين التنفس',
          description: 'تنفس بعمق واسترخِ',
          action: 'breathing',
        },
        {
          icon: '📝',
          title: 'اكتب مشاعرك',
          description: 'عبّر عما بداخلك',
          action: 'journal',
        },
        {
          icon: '🎬',
          title: 'شاهد فيديو مضحك',
          description: 'حاول رفع معنوياتك',
          action: 'video',
        },
      ],
      tips: [
        'تذكر أن الحزن مشاعر طبيعية وستمر',
        'لا تحتفظ بمشاعرك لوحدك، شاركها',
        'خذ وقتك وكن لطيفاً مع نفسك',
      ],
    },
    anxious: {
      emoji: '😰',
      color: '#fbbf24',
      title: 'تشعر بالقلق',
      message: 'القلق شعور طبيعي، لكن يمكننا التعامل معه معاً',
      activities: [
        {
          icon: '🧘',
          title: 'تمرين التنفس',
          description: '5 دقائق من التنفس الهادئ',
          action: 'breathing',
        },
        {
          icon: '🎯',
          title: 'حدد ما يقلقك',
          description: 'اكتب مخاوفك وفكر بحلول',
          action: 'journal',
        },
        {
          icon: '🎵',
          title: 'موسيقى هادئة',
          description: 'استمع لأصوات مريحة',
          action: 'music',
        },
        {
          icon: '🚶',
          title: 'تحرك قليلاً',
          description: 'المشي يساعد على تصفية الذهن',
          action: 'exercise',
        },
      ],
      tips: [
        'ركز على اللحظة الحالية',
        'تنفس ببطء وعمق',
        'تحدث مع شخص كبير تثق به',
      ],
    },
    angry: {
      emoji: '😠',
      color: '#f87171',
      title: 'تشعر بالغضب',
      message: 'الغضب شعور قوي، دعنا نساعدك على إدارته بشكل صحي',
      activities: [
        {
          icon: '🧘',
          title: 'تنفس بعمق',
          description: 'هدّئ نفسك بالتنفس',
          action: 'breathing',
        },
        {
          icon: '🏃',
          title: 'حرّك جسمك',
          description: 'اخرج طاقة الغضب بطريقة صحية',
          action: 'exercise',
        },
        {
          icon: '📝',
          title: 'اكتب ما تشعر به',
          description: 'عبّر عن غضبك بالكتابة',
          action: 'journal',
        },
        {
          icon: '🎨',
          title: 'ارسم مشاعرك',
          description: 'حوّل غضبك لإبداع',
          action: 'draw',
        },
      ],
      tips: [
        'عد من 1 إلى 10 ببطء',
        'خذ استراحة قبل الرد أو التصرف',
        'حاول فهم سبب غضبك الحقيقي',
      ],
    },
    calm: {
      emoji: '😌',
      color: '#a78bfa',
      title: 'أنت هادئ',
      message: 'شعور رائع! استمتع بهذا السلام الداخلي',
      activities: [
        {
          icon: '📖',
          title: 'اقرأ كتاباً',
          description: 'استمتع بالقراءة الهادئة',
          action: 'story',
        },
        {
          icon: '🧘',
          title: 'تأمل قليلاً',
          description: 'عمّق شعورك بالهدوء',
          action: 'breathing',
        },
        {
          icon: '📝',
          title: 'اكتب يومياتك',
          description: 'سجّل أفكارك الهادئة',
          action: 'journal',
        },
        {
          icon: '🎵',
          title: 'استمع للموسيقى',
          description: 'موسيقى هادئة ومريحة',
          action: 'music',
        },
      ],
      tips: [
        'احتفظ بهذا الشعور الجميل',
        'فكر في الأشياء التي تشعر بالامتنان لها',
        'استمتع باللحظة الحالية',
      ],
    },
    excited: {
      emoji: '🤩',
      color: '#fb923c',
      title: 'أنت متحمس جداً!',
      message: 'طاقة رائعة! استخدمها في أشياء ممتعة ومفيدة',
      activities: [
        {
          icon: '🎮',
          title: 'العب لعبة تفاعلية',
          description: 'استمتع بألعاب مسلية',
          action: 'game',
        },
        {
          icon: '🎨',
          title: 'ابدع في شيء جديد',
          description: 'ارسم أو اصنع شيئاً',
          action: 'draw',
        },
        {
          icon: '🤸',
          title: 'تحرك وارقص',
          description: 'عبّر عن حماسك بالحركة',
          action: 'exercise',
        },
        {
          icon: '📖',
          title: 'اقرأ قصة مغامرات',
          description: 'استمتع بقصة مشوقة',
          action: 'story',
        },
      ],
      tips: [
        'وجّه طاقتك نحو شيء إيجابي',
        'شارك حماسك مع الآخرين',
        'استمتع بكل لحظة',
      ],
    },
  };

  const currentAdvice = adviceData[mood] || adviceData.calm;

  return (
    <div className="mood-advice-container">
      <div className="mood-advice-header" style={{ borderColor: currentAdvice.color }}>
        <div className="mood-advice-emoji">{currentAdvice.emoji}</div>
        <h2 style={{ color: currentAdvice.color }}>{currentAdvice.title}</h2>
        <p>{currentAdvice.message}</p>
      </div>

      <div className="activities-section">
        <h3>أنشطة مقترحة لك:</h3>
        <div className="activities-grid">
          {currentAdvice.activities.map((activity, index) => (
            <button
              key={index}
              className="activity-card"
              onClick={() => onActivitySelect && onActivitySelect(activity.action)}
              style={{ borderColor: currentAdvice.color }}
            >
              <div className="activity-icon">{activity.icon}</div>
              <h4>{activity.title}</h4>
              <p>{activity.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="tips-section" style={{ backgroundColor: `${currentAdvice.color}15` }}>
        <h3>💡 نصائح مفيدة:</h3>
        <ul>
          {currentAdvice.tips.map((tip, index) => (
            <li key={index} style={{ color: currentAdvice.color }}>
              {tip}
            </li>
          ))}
        </ul>
      </div>

      <div className="encouragement-box">
        <span className="encouragement-icon">💪</span>
        <p>أنت تقوم بعمل رائع بالاهتمام بمشاعرك!</p>
      </div>
    </div>
  );
};

export default MoodAdvice;
