type Params = { lang: string };
interface TestPageProps {
    params: Promise<Params>;
}

export default async function TestPage({ params }: TestPageProps) {
    const { lang } = await params;

    // 간단한 번역 데이터
    const translations = {
        ko: {
            title: '다국어 테스트 페이지',
            description:
                '이 페이지는 다국어 지원 기능을 테스트하는 페이지입니다.',
            languageInfo: '현재 선택된 언어',
            backToHome: '홈으로 돌아가기',
        },
        en: {
            title: 'Multilingual Test Page',
            description: 'This page is for testing multilingual support.',
            languageInfo: 'Currently selected language',
            backToHome: 'Back to Home',
        },
    };

    // 지원하지 않는 언어인 경우 기본값으로 한국어 사용
    const selectedLang = lang === 'ko' || lang === 'en' ? lang : 'ko';
    //lang 이 "ko"나 "en"이 아닐 경우에도 fallback "ko"를 기준으로 번역합니다
    const t = translations[selectedLang as keyof typeof translations];

    return (
        <div className="mx-auto max-w-4xl p-6">
            <h1 className="mb-4 text-2xl font-bold">{t.title}</h1>
            <p className="mb-6">{t.description}</p>

            <div className="mb-6 rounded bg-gray-100 p-4 dark:bg-gray-800">
                <p>
                    <strong>{t.languageInfo}:</strong> {selectedLang}
                </p>
            </div>

            <div className="flex items-center space-x-3">
                {/* 같은 언어로 홈페이지로 이동하는 링크 */}
                <a
                    href={`/${selectedLang}`}
                    className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                    {t.backToHome}
                </a>

                {/* 다른 언어로 현재 페이지를 보는 링크 */}
                <a
                    href={`/${selectedLang === 'ko' ? 'en' : 'ko'}/test`}
                    className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                >
                    {selectedLang === 'ko' ? 'English' : '한국어'}
                </a>
            </div>
        </div>
    );
}
