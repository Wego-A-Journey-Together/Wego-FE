import Greet from '@/app/[lang]/auth/Greet';
import LoginForm from '@/app/[lang]/auth/LoginForm';

export default function LoginPage() {
    return (
        //네브바 높이 감안한 pt-16
        <div className="flex min-h-screen w-full items-center justify-center pt-16 text-center">
            <h1 className={`sr-only`}>로그인 페이지임</h1>
            <div className={`mt-7 flex w-full flex-col lg:flex-row`}>
                {/*텍스트 제목과 이미지 섹션*/}
                <section className={`p-4 lg:flex-1`}>
                    <Greet />
                </section>
                {/*회원가입 폼 랜더*/}
                <section className={`p-4 lg:min-h-[600px] lg:flex-1`}>
                    <LoginForm />
                </section>
            </div>
        </div>
    );
}
