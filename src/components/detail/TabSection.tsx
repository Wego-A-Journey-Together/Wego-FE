import Tab from '@/components/detail/Tab';

export default function TabSection() {
    return (
        // 탭 섹션
        <section className={`sticky top-18 mt-17.5`}>
            <p className={`sr-only`}>탭그룹</p>
            <Tab />
            <div className={`h-px w-full rounded-full bg-[#D9D9D9]`} />
        </section>
    );
}
