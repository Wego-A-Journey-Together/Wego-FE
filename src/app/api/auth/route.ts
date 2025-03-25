const handlekakaoLogin = () => {
    const KAKAO_AUTH_KEY = process.env.KAKAO_AUTH_KEY;
    const CALL_BACK_URI = `${process.env.SPRING_URI}/api/user/kakao/callback`;
    const temp = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_AUTH_KEY}&redirect_uri=${CALL_BACK_URI}&response_type=code`;
    console.log(temp);
    window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_AUTH_KEY}&redirect_uri=${CALL_BACK_URI}&response_type=code`;
};
