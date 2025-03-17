import Greet from '@/app/[lang]/auth/Greet';
import RegisterForm from '@/app/[lang]/auth/RegisterForm';

export default function RegisterPage() {
    return (
        //네브바 높이 감안한 pt-16
        <div className="flex min-h-screen w-full items-center justify-center pt-16 text-center">
            <h1 className={`sr-only`}>회원 가입 페이지임</h1>
            <div className={`mt-7 flex w-full flex-col lg:flex-row`}>
                {/*텍스트 제목과 이미지 섹션*/}
                <section className={`p-4 lg:flex-1`}>
                    <Greet />
                </section>
                {/*회원가입 폼 랜더*/}
                <section className={`p-4 lg:min-h-[600px] lg:flex-1`}>
                    <RegisterForm />
                </section>
            </div>
        </div>
    );
}
