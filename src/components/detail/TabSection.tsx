import Tab from '@/components/detail/Tab';

export default function TabSection() {
    return (
        // 탭 섹션
        <section
            className={`sticky top-18 z-50 mt-17.5 border-b border-b-[#AAAAAAA]`}
        >
            <p className={`sr-only`}>탭그룹</p>
            <Tab />
        </section>
    );
}
