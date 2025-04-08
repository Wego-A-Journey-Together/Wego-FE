'use client';

import KAKAOLogin from '@/components/Btn/KAKAOLogin';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { closeLoginModal, openLoginModal } from '@/redux/slices/modalSlice';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginModal() {
    const open = useAppSelector((state) => state.modal.loginModalOpen);
    const dispatch = useAppDispatch();
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (searchParams.get('loginRequired') === 'true') {
            dispatch(openLoginModal());
        }
    }, [searchParams]);

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            dispatch(closeLoginModal());

            const loginRequired = searchParams.get('loginRequired');
            if (loginRequired === 'true') {
                const params = new URLSearchParams(window.location.search);
                params.delete('loginRequired');
                const newUrl =
                    pathname +
                    (params.toString() ? `?${params.toString()}` : '');
                router.replace(newUrl);
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange} modal={true}>
            <DialogContent className="flex flex-col items-center justify-start py-5 sm:max-w-md">
                <DialogClose className="absolute top-4 right-4 rounded-sm opacity-70 hover:opacity-100" />

                <DialogHeader className="relative">
                    <div>
                        <svg
                            width="89"
                            height="34"
                            viewBox="0 0 89 34"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <mask
                                id="path-1-outside-1_531_25578"
                                maskUnits="userSpaceOnUse"
                                x="0"
                                y="0"
                                width="89"
                                height="34"
                                fill="black"
                            >
                                <rect fill="white" width="89" height="34" />
                                <path d="M6.26154 25L1.01538 1.30769H4.19692L8.83385 22.36L13.8092 1.30769H17.3292L22.2708 22.3262L26.9415 1.30769H30.1231L24.8769 25H20.0708L15.5692 5.91077L11.0677 25H6.26154ZM40.7727 25.5077C39.1707 25.5077 37.7378 25.1579 36.4743 24.4585C35.2332 23.7364 34.2517 22.6759 33.5296 21.2769C32.8302 19.8554 32.4804 18.1067 32.4804 16.0308C32.4804 13.9323 32.8302 12.1836 33.5296 10.7846C34.2517 9.38564 35.2219 8.33641 36.4404 7.63692C37.6589 6.91487 39.024 6.55385 40.5358 6.55385C42.6794 6.55385 44.4168 7.21949 45.7481 8.55077C47.0794 9.88205 47.745 11.9015 47.745 14.6092V16.9785H35.8989C36.0343 18.9641 36.5532 20.4421 37.4558 21.4123C38.3809 22.3826 39.5204 22.8677 40.8743 22.8677C42.025 22.8677 43.0291 22.6533 43.8866 22.2246C44.744 21.7733 45.4209 21.2995 45.9173 20.8031L47.3727 22.5631C46.6732 23.3528 45.7594 24.041 44.6312 24.6277C43.503 25.2144 42.2168 25.5077 40.7727 25.5077ZM35.9327 14.6092H44.5296C44.5296 12.8718 44.1799 11.5405 43.4804 10.6154C42.8035 9.66769 41.8332 9.19385 40.5696 9.19385C39.3512 9.19385 38.3132 9.64513 37.4558 10.5477C36.6209 11.4277 36.1132 12.7815 35.9327 14.6092ZM59.9912 32.9538C54.5307 32.9538 51.8005 31.2277 51.8005 27.7754C51.8005 27.0082 52.0261 26.2974 52.4774 25.6431C52.9287 24.9887 53.5266 24.4585 54.2712 24.0523C53.4589 23.3077 53.0528 22.281 53.0528 20.9723C53.0528 20.2954 53.1882 19.6523 53.4589 19.0431C53.7297 18.4338 54.1584 17.9036 54.7451 17.4523C54.2487 16.9108 53.8538 16.2677 53.5605 15.5231C53.2897 14.7785 53.1543 13.9549 53.1543 13.0523C53.1543 11.6759 53.4477 10.5138 54.0343 9.56615C54.6436 8.5959 55.4671 7.85128 56.5051 7.33231C57.543 6.81333 58.7164 6.55385 60.0251 6.55385C61.1307 6.55385 62.1574 6.74564 63.1051 7.12923C63.6241 7.10667 64.0753 6.88102 64.4589 6.45231C64.8425 6.02359 65.0343 5.23385 65.0343 4.08308H65.7112L67.6743 4.76C67.6743 5.93333 67.46 6.82462 67.0312 7.43384C66.6251 8.02051 66.061 8.43795 65.3389 8.68615C65.8353 9.22769 66.2189 9.87077 66.4897 10.6154C66.783 11.3374 66.9297 12.1497 66.9297 13.0523C66.9297 14.4062 66.6251 15.5682 66.0159 16.5385C65.4066 17.4862 64.583 18.2195 63.5451 18.7385C62.5071 19.2574 61.3338 19.5169 60.0251 19.5169C58.6487 19.5169 57.4302 19.2462 56.3697 18.7046C55.8056 19.2236 55.5236 19.8779 55.5236 20.6677C55.5236 21.2318 55.7153 21.7056 56.0989 22.0892C56.4825 22.4503 57.0805 22.6308 57.8928 22.6308H62.3605C63.3984 22.6308 64.3574 22.7887 65.2374 23.1046C66.1174 23.4205 66.8282 23.9282 67.3697 24.6277C67.9112 25.3272 68.182 26.2636 68.182 27.4369C68.182 29.1518 67.4825 30.4944 66.0836 31.4646C64.7071 32.4574 62.6764 32.9538 59.9912 32.9538ZM60.0251 17.2154C60.6343 17.2154 61.221 17.0687 61.7851 16.7754C62.3718 16.4821 62.8569 16.0308 63.2405 15.4215C63.6241 14.8123 63.8159 14.0226 63.8159 13.0523C63.8159 12.0595 63.6241 11.2585 63.2405 10.6492C62.8569 10.04 62.3718 9.58872 61.7851 9.29538C61.221 9.00205 60.6343 8.85538 60.0251 8.85538C59.4384 8.85538 58.8518 9.00205 58.2651 9.29538C57.6784 9.58872 57.1933 10.04 56.8097 10.6492C56.4487 11.2585 56.2682 12.0595 56.2682 13.0523C56.2682 14.0226 56.4487 14.8123 56.8097 15.4215C57.1933 16.0308 57.6784 16.4821 58.2651 16.7754C58.8518 17.0687 59.4384 17.2154 60.0251 17.2154ZM59.9912 30.4492C61.7512 30.4492 63.06 30.2123 63.9174 29.7385C64.7748 29.2646 65.2036 28.5087 65.2036 27.4708C65.2036 26.839 65.0456 26.3651 64.7297 26.0492C64.4138 25.7559 64.0302 25.5528 63.5789 25.44C63.1277 25.3272 62.6764 25.2708 62.2251 25.2708H58.1636C57.3964 25.2708 56.6856 25.1805 56.0312 25C55.7153 25.3385 55.422 25.7221 55.1512 26.1508C54.903 26.6021 54.7789 27.0872 54.7789 27.6062C54.7789 29.5015 56.5164 30.4492 59.9912 30.4492ZM79.5406 25.5077C77.9837 25.5077 76.5847 25.1579 75.3437 24.4585C74.1252 23.7364 73.1549 22.6759 72.4329 21.2769C71.7334 19.8554 71.3837 18.1067 71.3837 16.0308C71.3837 13.9323 71.7334 12.1836 72.4329 10.7846C73.1549 9.38564 74.1252 8.33641 75.3437 7.63692C76.5847 6.91487 77.9837 6.55385 79.5406 6.55385C81.0975 6.55385 82.4852 6.91487 83.7037 7.63692C84.9447 8.33641 85.9262 9.38564 86.6483 10.7846C87.3703 12.1836 87.7313 13.9323 87.7313 16.0308C87.7313 18.1067 87.3703 19.8554 86.6483 21.2769C85.9262 22.6759 84.9447 23.7364 83.7037 24.4585C82.4852 25.1579 81.0975 25.5077 79.5406 25.5077ZM79.5406 22.8677C80.9395 22.8677 82.0903 22.3149 82.9929 21.2092C83.8954 20.081 84.3467 18.3549 84.3467 16.0308C84.3467 13.7067 83.8954 11.9918 82.9929 10.8862C82.0903 9.75795 80.9395 9.19385 79.5406 9.19385C78.1642 9.19385 77.0247 9.75795 76.1221 10.8862C75.2195 11.9918 74.7683 13.7067 74.7683 16.0308C74.7683 18.3549 75.2195 20.081 76.1221 21.2092C77.0247 22.3149 78.1642 22.8677 79.5406 22.8677Z" />
                            </mask>
                            <path
                                d="M6.26154 25L1.01538 1.30769H4.19692L8.83385 22.36L13.8092 1.30769H17.3292L22.2708 22.3262L26.9415 1.30769H30.1231L24.8769 25H20.0708L15.5692 5.91077L11.0677 25H6.26154ZM40.7727 25.5077C39.1707 25.5077 37.7378 25.1579 36.4743 24.4585C35.2332 23.7364 34.2517 22.6759 33.5296 21.2769C32.8302 19.8554 32.4804 18.1067 32.4804 16.0308C32.4804 13.9323 32.8302 12.1836 33.5296 10.7846C34.2517 9.38564 35.2219 8.33641 36.4404 7.63692C37.6589 6.91487 39.024 6.55385 40.5358 6.55385C42.6794 6.55385 44.4168 7.21949 45.7481 8.55077C47.0794 9.88205 47.745 11.9015 47.745 14.6092V16.9785H35.8989C36.0343 18.9641 36.5532 20.4421 37.4558 21.4123C38.3809 22.3826 39.5204 22.8677 40.8743 22.8677C42.025 22.8677 43.0291 22.6533 43.8866 22.2246C44.744 21.7733 45.4209 21.2995 45.9173 20.8031L47.3727 22.5631C46.6732 23.3528 45.7594 24.041 44.6312 24.6277C43.503 25.2144 42.2168 25.5077 40.7727 25.5077ZM35.9327 14.6092H44.5296C44.5296 12.8718 44.1799 11.5405 43.4804 10.6154C42.8035 9.66769 41.8332 9.19385 40.5696 9.19385C39.3512 9.19385 38.3132 9.64513 37.4558 10.5477C36.6209 11.4277 36.1132 12.7815 35.9327 14.6092ZM59.9912 32.9538C54.5307 32.9538 51.8005 31.2277 51.8005 27.7754C51.8005 27.0082 52.0261 26.2974 52.4774 25.6431C52.9287 24.9887 53.5266 24.4585 54.2712 24.0523C53.4589 23.3077 53.0528 22.281 53.0528 20.9723C53.0528 20.2954 53.1882 19.6523 53.4589 19.0431C53.7297 18.4338 54.1584 17.9036 54.7451 17.4523C54.2487 16.9108 53.8538 16.2677 53.5605 15.5231C53.2897 14.7785 53.1543 13.9549 53.1543 13.0523C53.1543 11.6759 53.4477 10.5138 54.0343 9.56615C54.6436 8.5959 55.4671 7.85128 56.5051 7.33231C57.543 6.81333 58.7164 6.55385 60.0251 6.55385C61.1307 6.55385 62.1574 6.74564 63.1051 7.12923C63.6241 7.10667 64.0753 6.88102 64.4589 6.45231C64.8425 6.02359 65.0343 5.23385 65.0343 4.08308H65.7112L67.6743 4.76C67.6743 5.93333 67.46 6.82462 67.0312 7.43384C66.6251 8.02051 66.061 8.43795 65.3389 8.68615C65.8353 9.22769 66.2189 9.87077 66.4897 10.6154C66.783 11.3374 66.9297 12.1497 66.9297 13.0523C66.9297 14.4062 66.6251 15.5682 66.0159 16.5385C65.4066 17.4862 64.583 18.2195 63.5451 18.7385C62.5071 19.2574 61.3338 19.5169 60.0251 19.5169C58.6487 19.5169 57.4302 19.2462 56.3697 18.7046C55.8056 19.2236 55.5236 19.8779 55.5236 20.6677C55.5236 21.2318 55.7153 21.7056 56.0989 22.0892C56.4825 22.4503 57.0805 22.6308 57.8928 22.6308H62.3605C63.3984 22.6308 64.3574 22.7887 65.2374 23.1046C66.1174 23.4205 66.8282 23.9282 67.3697 24.6277C67.9112 25.3272 68.182 26.2636 68.182 27.4369C68.182 29.1518 67.4825 30.4944 66.0836 31.4646C64.7071 32.4574 62.6764 32.9538 59.9912 32.9538ZM60.0251 17.2154C60.6343 17.2154 61.221 17.0687 61.7851 16.7754C62.3718 16.4821 62.8569 16.0308 63.2405 15.4215C63.6241 14.8123 63.8159 14.0226 63.8159 13.0523C63.8159 12.0595 63.6241 11.2585 63.2405 10.6492C62.8569 10.04 62.3718 9.58872 61.7851 9.29538C61.221 9.00205 60.6343 8.85538 60.0251 8.85538C59.4384 8.85538 58.8518 9.00205 58.2651 9.29538C57.6784 9.58872 57.1933 10.04 56.8097 10.6492C56.4487 11.2585 56.2682 12.0595 56.2682 13.0523C56.2682 14.0226 56.4487 14.8123 56.8097 15.4215C57.1933 16.0308 57.6784 16.4821 58.2651 16.7754C58.8518 17.0687 59.4384 17.2154 60.0251 17.2154ZM59.9912 30.4492C61.7512 30.4492 63.06 30.2123 63.9174 29.7385C64.7748 29.2646 65.2036 28.5087 65.2036 27.4708C65.2036 26.839 65.0456 26.3651 64.7297 26.0492C64.4138 25.7559 64.0302 25.5528 63.5789 25.44C63.1277 25.3272 62.6764 25.2708 62.2251 25.2708H58.1636C57.3964 25.2708 56.6856 25.1805 56.0312 25C55.7153 25.3385 55.422 25.7221 55.1512 26.1508C54.903 26.6021 54.7789 27.0872 54.7789 27.6062C54.7789 29.5015 56.5164 30.4492 59.9912 30.4492ZM79.5406 25.5077C77.9837 25.5077 76.5847 25.1579 75.3437 24.4585C74.1252 23.7364 73.1549 22.6759 72.4329 21.2769C71.7334 19.8554 71.3837 18.1067 71.3837 16.0308C71.3837 13.9323 71.7334 12.1836 72.4329 10.7846C73.1549 9.38564 74.1252 8.33641 75.3437 7.63692C76.5847 6.91487 77.9837 6.55385 79.5406 6.55385C81.0975 6.55385 82.4852 6.91487 83.7037 7.63692C84.9447 8.33641 85.9262 9.38564 86.6483 10.7846C87.3703 12.1836 87.7313 13.9323 87.7313 16.0308C87.7313 18.1067 87.3703 19.8554 86.6483 21.2769C85.9262 22.6759 84.9447 23.7364 83.7037 24.4585C82.4852 25.1579 81.0975 25.5077 79.5406 25.5077ZM79.5406 22.8677C80.9395 22.8677 82.0903 22.3149 82.9929 21.2092C83.8954 20.081 84.3467 18.3549 84.3467 16.0308C84.3467 13.7067 83.8954 11.9918 82.9929 10.8862C82.0903 9.75795 80.9395 9.19385 79.5406 9.19385C78.1642 9.19385 77.0247 9.75795 76.1221 10.8862C75.2195 11.9918 74.7683 13.7067 74.7683 16.0308C74.7683 18.3549 75.2195 20.081 76.1221 21.2092C77.0247 22.3149 78.1642 22.8677 79.5406 22.8677Z"
                                fill="#0AC7E4"
                            />
                            <path
                                d="M6.26154 25L5.67573 25.1297L5.77986 25.6H6.26154V25ZM1.01538 1.30769V0.707691H0.267994L0.429574 1.43741L1.01538 1.30769ZM4.19692 1.30769L4.78288 1.17863L4.67915 0.707691H4.19692V1.30769ZM8.83385 22.36L8.24789 22.4891L9.41776 22.498L8.83385 22.36ZM13.8092 1.30769V0.707691H13.3345L13.2253 1.16969L13.8092 1.30769ZM17.3292 1.30769L17.9133 1.17037L17.8045 0.707691H17.3292V1.30769ZM22.2708 22.3262L21.6867 22.4635L22.8565 22.4563L22.2708 22.3262ZM26.9415 1.30769V0.707691H26.4602L26.3558 1.17753L26.9415 1.30769ZM30.1231 1.30769L30.7089 1.43741L30.8705 0.707691H30.1231V1.30769ZM24.8769 25V25.6H25.3586L25.4627 25.1297L24.8769 25ZM20.0708 25L19.4868 25.1377L19.5958 25.6H20.0708V25ZM15.5692 5.91077L16.1532 5.77306H14.9852L15.5692 5.91077ZM11.0677 25V25.6H11.5427L11.6517 25.1377L11.0677 25ZM6.84735 24.8703L1.6012 1.17798L0.429574 1.43741L5.67573 25.1297L6.84735 24.8703ZM1.01538 1.90769H4.19692V0.707691H1.01538V1.90769ZM3.61097 1.43675L8.24789 22.4891L9.4198 22.2309L4.78288 1.17863L3.61097 1.43675ZM9.41776 22.498L14.3931 1.44569L13.2253 1.16969L8.24993 22.222L9.41776 22.498ZM13.8092 1.90769H17.3292V0.707691H13.8092V1.90769ZM16.7452 1.44501L21.6867 22.4635L22.8548 22.1888L17.9133 1.17037L16.7452 1.44501ZM22.8565 22.4563L27.5273 1.43785L26.3558 1.17753L21.6851 22.196L22.8565 22.4563ZM26.9415 1.90769H30.1231V0.707691H26.9415V1.90769ZM29.5373 1.17798L24.2911 24.8703L25.4627 25.1297L30.7089 1.43741L29.5373 1.17798ZM24.8769 24.4H20.0708V25.6H24.8769V24.4ZM20.6548 24.8623L16.1532 5.77306L14.9852 6.04848L19.4868 25.1377L20.6548 24.8623ZM14.9852 5.77306L10.4837 24.8623L11.6517 25.1377L16.1532 6.04848L14.9852 5.77306ZM11.0677 24.4H6.26154V25.6H11.0677V24.4ZM36.4743 24.4585L36.1725 24.9772L36.1837 24.9834L36.4743 24.4585ZM33.5296 21.2769L32.9912 21.5419L32.9965 21.5521L33.5296 21.2769ZM33.5296 10.7846L32.9964 10.5094L32.993 10.5163L33.5296 10.7846ZM36.4404 7.63692L36.7392 8.15732L36.7463 8.1531L36.4404 7.63692ZM47.745 16.9785V17.5785H48.345V16.9785H47.745ZM35.8989 16.9785V16.3785H35.2566L35.3003 17.0193L35.8989 16.9785ZM37.4558 21.4123L37.0164 21.821L37.0215 21.8264L37.4558 21.4123ZM43.8866 22.2246L44.1549 22.7614L44.166 22.7556L43.8866 22.2246ZM45.9173 20.8031L46.3797 20.4207L45.9594 19.9125L45.4931 20.3788L45.9173 20.8031ZM47.3727 22.5631L47.8219 22.9609L48.1624 22.5765L47.8351 22.1807L47.3727 22.5631ZM44.6312 24.6277L44.3544 24.0954L44.6312 24.6277ZM35.9327 14.6092L35.3356 14.5503L35.2705 15.2092H35.9327V14.6092ZM44.5296 14.6092V15.2092H45.1296V14.6092H44.5296ZM43.4804 10.6154L42.9922 10.9641L42.9969 10.9708L43.0018 10.9772L43.4804 10.6154ZM37.4558 10.5477L37.0208 10.1344L37.0205 10.1347L37.4558 10.5477ZM40.7727 24.9077C39.261 24.9077 37.9301 24.5786 36.7648 23.9335L36.1837 24.9834C37.5456 25.7373 39.0803 26.1077 40.7727 26.1077V24.9077ZM36.776 23.9399C35.6432 23.2807 34.7377 22.3094 34.0628 21.0017L32.9965 21.5521C33.7657 23.0424 34.8233 24.1921 36.1725 24.9771L36.776 23.9399ZM34.068 21.012C33.4196 19.6944 33.0804 18.0422 33.0804 16.0308H31.8804C31.8804 18.1711 32.2407 20.0164 32.9913 21.5418L34.068 21.012ZM33.0804 16.0308C33.0804 13.9951 33.4202 12.3451 34.0663 11.0529L32.993 10.5163C32.2401 12.022 31.8804 13.8695 31.8804 16.0308H33.0804ZM34.0628 11.0598C34.7385 9.75063 35.6325 8.79254 36.7391 8.15728L36.1417 7.11657C34.8113 7.88028 33.7649 9.02065 32.9965 10.5094L34.0628 11.0598ZM36.7463 8.1531C37.8659 7.48963 39.1241 7.15385 40.5358 7.15385V5.95385C38.9239 5.95385 37.4519 6.34011 36.1345 7.12075L36.7463 8.1531ZM40.5358 7.15385C42.5442 7.15385 44.121 7.77217 45.3238 8.97503L46.1724 8.1265C44.7127 6.66681 42.8145 5.95385 40.5358 5.95385V7.15385ZM45.3238 8.97503C46.5012 10.1524 47.145 11.9906 47.145 14.6092H48.345C48.345 11.8125 47.6575 9.61168 46.1724 8.1265L45.3238 8.97503ZM47.145 14.6092V16.9785H48.345V14.6092H47.145ZM47.745 16.3785H35.8989V17.5785H47.745V16.3785ZM35.3003 17.0193C35.4405 19.0761 35.9833 20.7103 37.0165 21.821L37.8951 21.0036C37.1231 20.1738 36.628 18.8521 36.4975 16.9376L35.3003 17.0193ZM37.0215 21.8264C38.0612 22.9167 39.3582 23.4677 40.8743 23.4677V22.2677C39.6827 22.2677 38.7007 21.8484 37.89 20.9983L37.0215 21.8264ZM40.8743 23.4677C42.0997 23.4677 43.1991 23.2392 44.1549 22.7613L43.6182 21.688C42.8592 22.0675 41.9504 22.2677 40.8743 22.2677V23.4677ZM44.166 22.7556C45.0581 22.2861 45.7898 21.7791 46.3416 21.2273L45.4931 20.3788C45.052 20.8198 44.4299 21.2606 43.6071 21.6937L44.166 22.7556ZM45.4549 21.1854L46.9103 22.9454L47.8351 22.1807L46.3797 20.4207L45.4549 21.1854ZM46.9236 22.1653C46.2817 22.89 45.4304 23.5358 44.3544 24.0954L44.908 25.16C46.0884 24.5462 47.0648 23.8157 47.8219 22.9609L46.9236 22.1653ZM44.3544 24.0954C43.3226 24.6319 42.1336 24.9077 40.7727 24.9077V26.1077C42.3 26.1077 43.6833 25.7969 44.908 25.16L44.3544 24.0954ZM35.9327 15.2092H44.5296V14.0092H35.9327V15.2092ZM45.1296 14.6092C45.1296 12.8031 44.7679 11.3233 43.959 10.2535L43.0018 10.9772C43.5919 11.7577 43.9296 12.9405 43.9296 14.6092H45.1296ZM43.9686 10.2666C43.1684 9.14623 42.0077 8.59385 40.5696 8.59385V9.79385C41.6587 9.79385 42.4386 10.1892 42.9922 10.9641L43.9686 10.2666ZM40.5696 8.59385C39.1827 8.59385 37.9887 9.11557 37.0208 10.1344L37.8908 10.9609C38.6377 10.1747 39.5196 9.79385 40.5696 9.79385V8.59385ZM37.0205 10.1347C36.0573 11.15 35.5228 12.6547 35.3356 14.5503L36.5298 14.6682C36.7036 12.9083 37.1845 11.7054 37.8911 10.9606L37.0205 10.1347ZM52.4774 25.6431L51.9835 25.3024L52.4774 25.6431ZM54.2712 24.0523L54.5586 24.579L55.2954 24.1771L54.6767 23.61L54.2712 24.0523ZM53.4589 19.0431L52.9107 18.7994L53.4589 19.0431ZM54.7451 17.4523L55.1109 17.9279L55.6294 17.5291L55.1874 17.0469L54.7451 17.4523ZM53.5605 15.5231L52.9966 15.7281L52.9993 15.7356L53.0022 15.743L53.5605 15.5231ZM54.0343 9.56615L53.5262 9.24709L53.5242 9.25034L54.0343 9.56615ZM63.1051 7.12923L62.88 7.6854L63.0009 7.73433L63.1312 7.72866L63.1051 7.12923ZM64.4589 6.45231L64.9061 6.85238L64.4589 6.45231ZM65.0343 4.08308V3.48308H64.4343V4.08308H65.0343ZM65.7113 4.08308L65.9068 3.51585L65.8118 3.48308H65.7113V4.08308ZM67.6743 4.76H68.2743V4.33222L67.8699 4.19277L67.6743 4.76ZM67.0312 7.43384L66.5406 7.08854L66.5379 7.09232L67.0312 7.43384ZM65.3389 8.68615L65.1439 8.11874L64.2778 8.41647L64.8966 9.09159L65.3389 8.68615ZM66.4897 10.6154L65.9258 10.8204L65.9296 10.8309L65.9338 10.8412L66.4897 10.6154ZM66.0159 16.5385L66.5206 16.8629L66.524 16.8575L66.0159 16.5385ZM56.3697 18.7046L56.6426 18.1703L56.2707 17.9804L55.9635 18.2631L56.3697 18.7046ZM56.0989 22.0892L55.6747 22.5135L55.6811 22.5199L55.6877 22.5262L56.0989 22.0892ZM67.3697 24.6277L67.8441 24.2604V24.2604L67.3697 24.6277ZM66.0836 31.4646L65.7416 30.9715L65.7326 30.978L66.0836 31.4646ZM61.7851 16.7754L61.5167 16.2387L61.5083 16.2431L61.7851 16.7754ZM63.2405 15.4215L62.7327 15.1018V15.1019L63.2405 15.4215ZM63.2405 10.6492L62.7327 10.9689L63.2405 10.6492ZM61.7851 9.29538L61.5082 9.82778L61.5168 9.83204L61.7851 9.29538ZM58.2651 9.29538L58.5334 9.83204L58.2651 9.29538ZM56.8097 10.6492L56.302 10.3295L56.2977 10.3364L56.2935 10.3433L56.8097 10.6492ZM56.8097 15.4215L56.2935 15.7274L56.2977 15.7344L56.302 15.7412L56.8097 15.4215ZM58.2651 16.7754L58.5334 16.2387L58.2651 16.7754ZM63.9174 29.7385L64.2076 30.2636L63.9174 29.7385ZM64.7297 26.0492L65.154 25.625L65.1461 25.6171L65.138 25.6096L64.7297 26.0492ZM63.5789 25.44L63.7245 24.8579L63.5789 25.44ZM56.0312 25L56.1908 24.4216L55.8405 24.325L55.5926 24.5906L56.0312 25ZM55.1512 26.1508L54.644 25.8304L54.6343 25.8457L54.6255 25.8616L55.1512 26.1508ZM59.9912 32.3538C57.3049 32.3538 55.3925 31.9257 54.1688 31.1521C52.9915 30.4078 52.4005 29.3128 52.4005 27.7754H51.2005C51.2005 29.6903 51.9746 31.1846 53.5275 32.1664C55.0341 33.1189 57.2171 33.5538 59.9912 33.5538V32.3538ZM52.4005 27.7754C52.4005 27.1345 52.5865 26.5418 52.9713 25.9837L51.9835 25.3024C51.4658 26.0531 51.2005 26.8819 51.2005 27.7754H52.4005ZM52.9713 25.9837C53.3657 25.4119 53.8908 24.9433 54.5586 24.579L53.9839 23.5256C53.1625 23.9736 52.4917 24.5656 51.9835 25.3024L52.9713 25.9837ZM54.6767 23.61C54.0116 23.0004 53.6528 22.1472 53.6528 20.9723H52.4528C52.4528 22.4148 52.9063 23.615 53.8658 24.4946L54.6767 23.61ZM53.6528 20.9723C53.6528 20.378 53.7711 19.8181 54.0072 19.2868L52.9107 18.7994C52.6053 19.4865 52.4528 20.2128 52.4528 20.9723H53.6528ZM54.0072 19.2868C54.2331 18.7785 54.5945 18.3251 55.1109 17.9279L54.3793 16.9767C53.7223 17.4821 53.2263 18.0892 52.9107 18.7994L54.0072 19.2868ZM55.1874 17.0469C54.7449 16.5642 54.3875 15.9855 54.1187 15.3032L53.0022 15.743C53.3201 16.5499 53.7524 17.2573 54.3028 17.8577L55.1874 17.0469ZM54.1244 15.318C53.8806 14.6476 53.7543 13.8946 53.7543 13.0523H52.5543C52.5543 14.0152 52.6989 14.9093 52.9966 15.7281L54.1244 15.318ZM53.7543 13.0523C53.7543 11.7613 54.0289 10.7148 54.5445 9.88197L53.5242 9.25034C52.8664 10.3129 52.5543 11.5905 52.5543 13.0523H53.7543ZM54.5425 9.88521C55.0924 9.00936 55.8325 8.33943 56.7734 7.86896L56.2368 6.79565C55.1018 7.36314 54.1947 8.18244 53.5262 9.24709L54.5425 9.88521ZM56.7734 7.86896C57.7179 7.3967 58.7975 7.15385 60.0251 7.15385V5.95385C58.6352 5.95385 57.3681 6.22997 56.2368 6.79565L56.7734 7.86896ZM60.0251 7.15385C61.0599 7.15385 62.0094 7.33304 62.88 7.6854L63.3302 6.57306C62.3054 6.15824 61.2016 5.95385 60.0251 5.95385V7.15385ZM63.1312 7.72866C63.8298 7.69829 64.4275 7.38731 64.9061 6.85238L64.0118 6.05223C63.7232 6.37473 63.4184 6.51504 63.079 6.5298L63.1312 7.72866ZM64.9061 6.85238C65.4483 6.24639 65.6343 5.25528 65.6343 4.08308H64.4343C64.4343 5.21241 64.2368 5.80079 64.0118 6.05223L64.9061 6.85238ZM65.0343 4.68308H65.7113V3.48308H65.0343V4.68308ZM65.5157 4.6503L67.4787 5.32722L67.8699 4.19277L65.9068 3.51585L65.5157 4.6503ZM67.0743 4.76C67.0743 5.8755 66.8679 6.62341 66.5406 7.08855L67.5219 7.77914C68.052 7.02582 68.2743 5.99117 68.2743 4.76H67.0743ZM66.5379 7.09232C66.2098 7.56627 65.754 7.90903 65.1439 8.11874L65.534 9.25356C66.368 8.96687 67.0404 8.47476 67.5246 7.77537L66.5379 7.09232ZM64.8966 9.09159C65.3357 9.57053 65.6799 10.1441 65.9258 10.8204L67.0536 10.4103C66.758 9.59746 66.335 8.88485 65.7812 8.28072L64.8966 9.09159ZM65.9338 10.8412C66.1938 11.4811 66.3297 12.2151 66.3297 13.0523H67.5297C67.5297 12.0844 67.3723 11.1937 67.0456 10.3896L65.9338 10.8412ZM66.3297 13.0523C66.3297 14.3141 66.0468 15.3609 65.5077 16.2194L66.524 16.8575C67.2034 15.7755 67.5297 14.4982 67.5297 13.0523H66.3297ZM65.5112 16.214C64.962 17.0682 64.2213 17.7295 63.2768 18.2018L63.8134 19.2751C64.9448 18.7094 65.8512 17.9041 66.5206 16.8629L65.5112 16.214ZM63.2768 18.2018C62.3322 18.6741 61.2527 18.9169 60.0251 18.9169V20.1169C61.415 20.1169 62.6821 19.8408 63.8134 19.2751L63.2768 18.2018ZM60.0251 18.9169C58.7287 18.9169 57.6063 18.6624 56.6426 18.1703L56.0968 19.239C57.2541 19.8299 58.5686 20.1169 60.0251 20.1169V18.9169ZM55.9635 18.2631C55.2717 18.8995 54.9236 19.7159 54.9236 20.6677H56.1236C56.1236 20.04 56.3395 19.5477 56.7759 19.1462L55.9635 18.2631ZM54.9236 20.6677C54.9236 21.3838 55.1737 22.0125 55.6747 22.5135L56.5232 21.665C56.257 21.3988 56.1236 21.0797 56.1236 20.6677H54.9236ZM55.6877 22.5262C56.2298 23.0363 57.0079 23.2308 57.8928 23.2308V22.0308C57.1531 22.0308 56.7353 21.8642 56.5102 21.6523L55.6877 22.5262ZM57.8928 23.2308H62.3605V22.0308H57.8928V23.2308ZM62.3605 23.2308C63.3369 23.2308 64.2265 23.3792 65.0347 23.6693L65.4401 22.5399C64.4883 22.1982 63.46 22.0308 62.3605 22.0308V23.2308ZM65.0347 23.6693C65.8136 23.9489 66.4277 24.3911 66.8953 24.995L67.8441 24.2604C67.2286 23.4653 66.4212 22.8921 65.4401 22.5399L65.0347 23.6693ZM66.8953 24.995C67.3324 25.5596 67.582 26.3532 67.582 27.4369H68.782C68.782 26.174 68.4901 25.0948 67.8441 24.2604L66.8953 24.995ZM67.582 27.4369C67.582 28.9568 66.9775 30.1144 65.7416 30.9716L66.4255 31.9576C67.9875 30.8743 68.782 29.3468 68.782 27.4369H67.582ZM65.7326 30.978C64.5023 31.8654 62.6183 32.3538 59.9912 32.3538V33.5538C62.7344 33.5538 64.912 33.0495 66.4346 31.9512L65.7326 30.978ZM60.0251 17.8154C60.7349 17.8154 61.4162 17.6435 62.0619 17.3077L61.5083 16.2431C61.0258 16.4939 60.5337 16.6154 60.0251 16.6154V17.8154ZM62.0534 17.312C62.7477 16.9649 63.3121 16.434 63.7482 15.7412L62.7327 15.1019C62.4017 15.6276 61.9958 15.9992 61.5168 16.2387L62.0534 17.312ZM63.7482 15.7412C64.2096 15.0084 64.4159 14.0975 64.4159 13.0523H63.2159C63.2159 13.9476 63.0385 14.6162 62.7327 15.1018L63.7482 15.7412ZM64.4159 13.0523C64.4159 11.9876 64.2108 11.0643 63.7482 10.3295L62.7327 10.9689C63.0373 11.4526 63.2159 12.1313 63.2159 13.0523H64.4159ZM63.7482 10.3295C63.3121 9.63681 62.7477 9.10585 62.0534 8.75873L61.5168 9.83204C61.9958 10.0716 62.4017 10.4432 62.7327 10.9689L63.7482 10.3295ZM62.0619 8.76305C61.4162 8.42727 60.7349 8.25538 60.0251 8.25538V9.45538C60.5337 9.45538 61.0258 9.57684 61.5083 9.82771L62.0619 8.76305ZM60.0251 8.25538C59.3348 8.25538 58.6568 8.42871 57.9968 8.75873L58.5334 9.83204C59.0467 9.57539 59.5421 9.45538 60.0251 9.45538V8.25538ZM57.9968 8.75873C57.3025 9.10585 56.7381 9.63681 56.302 10.3295L57.3174 10.9689C57.6485 10.4432 58.0543 10.0716 58.5334 9.83204L57.9968 8.75873ZM56.2935 10.3433C55.8599 11.0751 55.6682 11.993 55.6682 13.0523H56.8682C56.8682 12.1259 57.0375 11.4418 57.3259 10.9551L56.2935 10.3433ZM55.6682 13.0523C55.6682 14.092 55.861 14.9975 56.2935 15.7274L57.3259 15.1157C57.0364 14.6271 56.8682 13.9532 56.8682 13.0523H55.6682ZM56.302 15.7412C56.7381 16.434 57.3025 16.9649 57.9968 17.312L58.5334 16.2387C58.0543 15.9992 57.6485 15.6276 57.3174 15.1019L56.302 15.7412ZM57.9968 17.312C58.6568 17.6421 59.3348 17.8154 60.0251 17.8154V16.6154C59.5421 16.6154 59.0467 16.4954 58.5334 16.2387L57.9968 17.312ZM59.9912 31.0492C61.7836 31.0492 63.2159 30.8117 64.2076 30.2636L63.6272 29.2133C62.904 29.6129 61.7189 29.8492 59.9912 29.8492V31.0492ZM64.2076 30.2636C64.7206 29.9801 65.1282 29.5982 65.4039 29.1122C65.6786 28.6279 65.8036 28.0733 65.8036 27.4708H64.6036C64.6036 27.9062 64.5142 28.2485 64.3601 28.5201C64.2071 28.79 63.9717 29.0229 63.6272 29.2133L64.2076 30.2636ZM65.8036 27.4708C65.8036 26.7465 65.6221 26.0931 65.154 25.625L64.3054 26.4735C64.4691 26.6372 64.6036 26.9315 64.6036 27.4708H65.8036ZM65.138 25.6096C64.7421 25.242 64.266 24.9933 63.7245 24.8579L63.4334 26.0221C63.7945 26.1124 64.0855 26.2698 64.3214 26.4889L65.138 25.6096ZM63.7245 24.8579C63.2271 24.7336 62.7269 24.6708 62.2251 24.6708V25.8708C62.6258 25.8708 63.0283 25.9208 63.4334 26.0221L63.7245 24.8579ZM62.2251 24.6708H58.1636V25.8708H62.2251V24.6708ZM58.1636 24.6708C57.4434 24.6708 56.7869 24.5861 56.1908 24.4216L55.8717 25.5784C56.5843 25.775 57.3493 25.8708 58.1636 25.8708V24.6708ZM55.5926 24.5906C55.2488 24.959 54.9329 25.3729 54.644 25.8304L55.6585 26.4712C55.9111 26.0712 56.1819 25.7179 56.4699 25.4094L55.5926 24.5906ZM54.6255 25.8616C54.3282 26.4022 54.1789 26.9869 54.1789 27.6062H55.3789C55.3789 27.1875 55.4779 26.8019 55.677 26.4399L54.6255 25.8616ZM54.1789 27.6062C54.1789 28.1749 54.3104 28.7008 54.5927 29.1629C54.8743 29.6235 55.2854 29.9874 55.7947 30.2652C56.7952 30.8109 58.2189 31.0492 59.9912 31.0492V29.8492C58.2887 29.8492 57.1063 29.6137 56.3693 29.2117C56.0099 29.0157 55.7695 28.7872 55.6167 28.5371C55.4647 28.2884 55.3789 27.9851 55.3789 27.6062H54.1789ZM75.3437 24.4585L75.0377 24.9748L75.049 24.9812L75.3437 24.4585ZM72.4329 21.2769L71.8944 21.5419L71.8997 21.5521L72.4329 21.2769ZM72.4329 10.7846L71.8997 10.5094L71.8962 10.5163L72.4329 10.7846ZM75.3437 7.63692L75.6424 8.15728L75.6454 8.15553L75.3437 7.63692ZM83.7037 7.63692L83.3977 8.15322L83.409 8.15961L83.7037 7.63692ZM86.6483 21.2769L87.1814 21.5521L87.1832 21.5486L86.6483 21.2769ZM83.7037 24.4585L84.0024 24.9788L84.0054 24.9771L83.7037 24.4585ZM82.9929 21.2092L83.4577 21.5887L83.4614 21.584L82.9929 21.2092ZM82.9929 10.8862L82.5243 11.261L82.5281 11.2656L82.9929 10.8862ZM76.1221 10.8862L76.5869 11.2656L76.5906 11.261L76.1221 10.8862ZM76.1221 21.2092L75.6536 21.5841L75.6573 21.5887L76.1221 21.2092ZM79.5406 24.9077C78.077 24.9077 76.7812 24.58 75.6383 23.9358L75.049 24.9812C76.3882 25.7359 77.8903 26.1077 79.5406 26.1077V24.9077ZM75.6495 23.9423C74.5385 23.2839 73.6424 22.3122 72.9661 21.0017L71.8997 21.5521C72.6675 23.0396 73.7119 24.1889 75.0378 24.9746L75.6495 23.9423ZM72.9712 21.012C72.3229 19.6944 71.9837 18.0422 71.9837 16.0308H70.7837C70.7837 18.1711 71.1439 20.0164 71.8945 21.5418L72.9712 21.012ZM71.9837 16.0308C71.9837 13.9951 72.3234 12.3451 72.9695 11.0529L71.8962 10.5163C71.1433 12.022 70.7837 13.8695 70.7837 16.0308H71.9837ZM72.9661 11.0598C73.6418 9.75063 74.5358 8.79254 75.6424 8.15728L75.0449 7.11657C73.7146 7.88028 72.6681 9.02065 71.8997 10.5094L72.9661 11.0598ZM75.6454 8.15553C76.7871 7.49125 78.0804 7.15385 79.5406 7.15385V5.95385C77.8869 5.95385 76.3822 6.3385 75.0419 7.11831L75.6454 8.15553ZM79.5406 7.15385C81.0009 7.15385 82.2809 7.49127 83.3978 8.1531L84.0095 7.12075C82.6894 6.33848 81.1941 5.95385 79.5406 5.95385V7.15385ZM83.409 8.15961C84.5375 8.79567 85.4409 9.75348 86.1151 11.0598L87.1814 10.5094C86.4116 9.0178 85.3518 7.87715 83.9983 7.11423L83.409 8.15961ZM86.1151 11.0598C86.7811 12.3502 87.1313 13.9975 87.1313 16.0308H88.3313C88.3313 13.8671 87.9595 12.017 87.1814 10.5094L86.1151 11.0598ZM87.1313 16.0308C87.1313 18.0398 86.7817 19.6894 86.1133 21.0052L87.1832 21.5486C87.959 20.0214 88.3313 18.1736 88.3313 16.0308H87.1313ZM86.1151 21.0017C85.4402 22.3094 84.5348 23.2807 83.4019 23.9399L84.0054 24.9771C85.3546 24.1921 86.4122 23.0424 87.1814 21.5521L86.1151 21.0017ZM83.4049 23.9381C82.2869 24.5799 81.0043 24.9077 79.5406 24.9077V26.1077C81.1907 26.1077 82.6834 25.736 84.0024 24.9788L83.4049 23.9381ZM79.5406 23.4677C81.1239 23.4677 82.4438 22.8306 83.4577 21.5887L82.5281 20.8298C81.7368 21.7991 80.7552 22.2677 79.5406 22.2677V23.4677ZM83.4614 21.584C84.4872 20.3017 84.9467 18.4139 84.9467 16.0308H83.7467C83.7467 18.2958 83.3036 19.8603 82.5244 20.8344L83.4614 21.584ZM84.9467 16.0308C84.9467 13.6491 84.4878 11.7687 83.4577 10.5067L82.5281 11.2656C83.3031 12.2149 83.7467 13.7643 83.7467 16.0308H84.9467ZM83.4614 10.5113C82.4493 9.24621 81.1286 8.59385 79.5406 8.59385V9.79385C80.7505 9.79385 81.7313 10.2697 82.5244 11.261L83.4614 10.5113ZM79.5406 8.59385C77.9717 8.59385 76.6635 9.24898 75.6536 10.5113L76.5906 11.261C77.3859 10.2669 78.3567 9.79385 79.5406 9.79385V8.59385ZM75.6573 10.5067C74.6272 11.7687 74.1683 13.6491 74.1683 16.0308H75.3683C75.3683 13.7643 75.8119 12.2149 76.5869 11.2656L75.6573 10.5067ZM74.1683 16.0308C74.1683 18.4139 74.6277 20.3017 75.6536 21.584L76.5906 20.8344C75.8113 19.8603 75.3683 18.2958 75.3683 16.0308H74.1683ZM75.6573 21.5887C76.669 22.8279 77.9764 23.4677 79.5406 23.4677V22.2677C78.3519 22.2677 77.3804 21.8018 76.5869 20.8298L75.6573 21.5887Z"
                                fill="#0AC7E4"
                                mask="url(#path-1-outside-1_531_25578)"
                            />
                        </svg>
                    </div>
                    <div className={'pt-4'}>
                        <DialogTitle>로그인이 필요합니다</DialogTitle>
                        <DialogDescription>
                            이 기능을 사용하려면 먼저 로그인해주세요.
                        </DialogDescription>
                    </div>
                </DialogHeader>
                <div className="pb-4">
                    <KAKAOLogin />
                </div>
            </DialogContent>
        </Dialog>
    );
}
