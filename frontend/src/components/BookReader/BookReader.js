import React, { useEffect, useMemo, useState } from 'react';
import './BookReader.css';

const books = [
  {
    id: 'book-1',
    title: 'رحلة في الغابة',
    level: 'مستوى سهل',
    duration: '4 دقائق',
    ageRange: '7-12',
    tags: ['تهدئة', 'قلق'],
    recommendedFor: [1, 2, 3],
    pages: [
      'في صباحٍ جميل، خرجت ليلى مع قطتها الصغيرة نونو نحو الغابة القريبة. كانت الشمس دافئة والهواء منعشاً، وكل شيء حولهما يبدو كأنه يبتسم.',
      'سمعت ليلى صوت عصافير يغني، فتوقفت لتستمع. قالت لنونو: "عندما نصغي للطبيعة نشعر بالهدوء". هزّت نونو ذيلها وكأنها توافقها.',
      'في نهاية الرحلة، عادت ليلى إلى المنزل سعيدة. كتبت في دفترها: "اليوم تعلمت أن الهدوء يسكن التفاصيل الصغيرة".',
    ],
  },
  {
    id: 'book-2',
    title: 'مدينة الألوان',
    level: 'مستوى متوسط',
    duration: '5 دقائق',
    ageRange: '8-14',
    tags: ['ثقة بالنفس', 'توتر'],
    recommendedFor: [2, 3, 4],
    pages: [
      'كان سامر يحب الرسم كثيراً، لكنه كان يخاف أن يخطئ. في يوم من الأيام، دخل إلى مدينة خيالية كل شوارعها مليئة بالألوان المتحركة.',
      'قابل سامر رساماً عجوزاً قال له: "لا يوجد خطأ في الفن، هناك تجربة فقط". أخذ سامر فرشاته وبدأ يرسم بابتسامة.',
      'عاد سامر إلى بيته وهو أكثر ثقة. ومنذ ذلك اليوم، صار يرسم كلما شعر بالتوتر حتى يهدأ قلبه.',
    ],
  },
  {
    id: 'book-3',
    title: 'نجمة قبل النوم',
    level: 'مستوى سهل',
    duration: '3 دقائق',
    ageRange: '6-11',
    tags: ['نوم', 'تهدئة'],
    recommendedFor: [1, 2, 3],
    pages: [
      'قبل النوم، كان يزن يفتح النافذة وينظر إلى السماء. كان يبحث دائماً عن نجمة لامعة يهمس لها بأمنية صغيرة.',
      'في كل ليلة، كان يتنفس ببطء ويعدّ: واحد... اثنان... ثلاثة. ثم يقول: "أنا بخير، وغداً يوم جديد".',
      'مع الوقت، صار يزن ينام بسرعة ويستيقظ بنشاط. اكتشف أن الهدوء عادة جميلة يستطيع صنعها بنفسه.',
    ],
  },
  {
    id: 'book-4',
    title: 'صندوق الشجاعة الصغيرة',
    level: 'مستوى متوسط',
    duration: '6 دقائق',
    ageRange: '8-13',
    tags: ['قلق', 'شجاعة'],
    recommendedFor: [1, 2, 3],
    pages: [
      'كان آسر يخاف من المشاركة في الصف. أعطته المعلمة صندوقاً صغيراً وقالت: "ضع فيه كل خطوة شجاعة تقوم بها".',
      'في اليوم الأول، رفع آسر يده مرة واحدة فقط. وفي اليوم الثاني، قرأ جملة قصيرة. صار الصندوق يمتلئ بورقات صغيرة تذكّره بتقدّمه.',
      'بعد أسابيع، أدرك آسر أن الشجاعة ليست غياب الخوف، بل أن يتحرك رغم وجوده. ابتسم وقال: "أنا أكبر كل يوم".',
    ],
  },
];

const checkInOptions = [
  { value: 1, label: 'متعب جداً' },
  { value: 2, label: 'متوتر' },
  { value: 3, label: 'عادي' },
  { value: 4, label: 'مرتاح' },
  { value: 5, label: 'ممتاز' },
];

const filterTabs = ['موصى به', 'تهدئة', 'قلق', 'ثقة بالنفس', 'نوم'];

const BookReader = ({ referenceMood = 3 }) => {
  const [selectedBookId, setSelectedBookId] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [activeFilter, setActiveFilter] = useState('موصى به');
  const [calmMode, setCalmMode] = useState(false);
  const [preMood, setPreMood] = useState(null);
  const [postMood, setPostMood] = useState(null);

  const filteredBooks = useMemo(() => {
    if (activeFilter === 'موصى به') {
      return books.filter((book) => book.recommendedFor.includes(referenceMood));
    }

    return books.filter((book) => book.tags.includes(activeFilter));
  }, [activeFilter, referenceMood]);

  useEffect(() => {
    const nextBookId = filteredBooks[0]?.id || books[0].id;

    if (!selectedBookId || !filteredBooks.some((book) => book.id === selectedBookId)) {
      setSelectedBookId(nextBookId);
      setCurrentPage(0);
    }
  }, [filteredBooks, selectedBookId]);

  const selectedBook = useMemo(
    () => books.find((book) => book.id === selectedBookId) || books[0],
    [selectedBookId]
  );

  const totalPages = selectedBook.pages.length;

  const handleSelectBook = (bookId) => {
    setSelectedBookId(bookId);
    setCurrentPage(0);
    setPostMood(null);
  };

  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  };

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const sessionImpact = useMemo(() => {
    if (!preMood || !postMood) {
      return null;
    }

    const delta = postMood - preMood;

    if (delta >= 1) {
      return {
        tone: 'positive',
        text: 'ممتاز! يبدو أن القصة ساعدتك على التحسن 🌟',
      };
    }

    if (delta <= -1) {
      return {
        tone: 'negative',
        text: 'يبدو أن القصة لم تكن مناسبة تماماً الآن، جرّب قصة تهدئة أخرى 💛',
      };
    }

    return {
      tone: 'neutral',
      text: 'حالياً مزاجك مستقر، وهذه نتيجة جيدة 👍',
    };
  }, [preMood, postMood]);

  return (
    <div className={`book-reader ${calmMode ? 'calm-mode' : ''}`}>
      <div className="book-reader-header">
        <div>
          <h2>📚 مكتبة القصص العلاجية</h2>
          <p>قصص قصيرة موجهة لتحسين المزاج بطريقة لطيفة</p>
        </div>
        <button
          type="button"
          className="calm-toggle"
          onClick={() => setCalmMode((prev) => !prev)}
        >
          {calmMode ? 'إيقاف الوضع الهادئ' : 'تشغيل الوضع الهادئ'}
        </button>
      </div>

      <div className="book-checkin">
        <span>قبل القراءة، كيف تشعر الآن؟</span>
        <div className="checkin-options">
          {checkInOptions.map((item) => (
            <button
              key={item.value}
              type="button"
              className={`checkin-btn ${preMood === item.value ? 'active' : ''}`}
              onClick={() => {
                setPreMood(item.value);
                setPostMood(null);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="book-filters">
        {filterTabs.map((tab) => (
          <button
            key={tab}
            type="button"
            className={`filter-chip ${activeFilter === tab ? 'active' : ''}`}
            onClick={() => setActiveFilter(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="book-list">
        {filteredBooks.map((book) => (
          <button
            key={book.id}
            type="button"
            className={`book-item ${book.id === selectedBookId ? 'active' : ''}`}
            onClick={() => handleSelectBook(book.id)}
          >
            <span className="book-title-row">
              <span className="book-title">{book.title}</span>
              {book.recommendedFor.includes(referenceMood) && (
                <span className="recommended-pill">موصى به</span>
              )}
            </span>
            <span className="book-level">{book.level} • {book.duration}</span>
            <span className="book-meta">العمر المناسب: {book.ageRange}</span>
          </button>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="empty-filter-state">
          لا توجد قصص ضمن هذا التصنيف حالياً.
        </div>
      )}

      <div className="book-content">
        <h3>{selectedBook.title}</h3>
        <div className="book-tags">
          {selectedBook.tags.map((tag) => (
            <span key={tag} className="book-tag">{tag}</span>
          ))}
        </div>
        <p className="book-page-text">{selectedBook.pages[currentPage]}</p>

        <div className="book-pagination">
          <button type="button" onClick={prevPage} disabled={currentPage === 0}>
            الصفحة السابقة
          </button>
          <span>
            صفحة {currentPage + 1} من {totalPages}
          </span>
          <button
            type="button"
            onClick={nextPage}
            disabled={currentPage === totalPages - 1}
          >
            الصفحة التالية
          </button>
        </div>

        {currentPage === totalPages - 1 && (
          <div className="post-reading-checkin">
            <span>بعد القراءة، كيف أصبح شعورك؟</span>
            <div className="checkin-options">
              {checkInOptions.map((item) => (
                <button
                  key={`post-${item.value}`}
                  type="button"
                  className={`checkin-btn ${postMood === item.value ? 'active' : ''}`}
                  onClick={() => setPostMood(item.value)}
                >
                  {item.label}
                </button>
              ))}
            </div>
            {sessionImpact && (
              <p className={`session-impact ${sessionImpact.tone}`}>
                {sessionImpact.text}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookReader;
