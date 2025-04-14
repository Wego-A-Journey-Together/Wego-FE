'use client';

import { BikeIcon, MountainIcon } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

type Props = {
    lat: number;
    lng: number;
};

/**
 * 코드 중복이 있지만 훅으로 분리하지 않고 우선 글 작성 페이지 카카오 지도 로직을 끌고와서 수정했습니다.
 * @param placeName
 * @param lat
 * @param lng
 * @constructor
 */
export default function KakaoMapViewer({ lat, lng }: Props) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<kakao.maps.Map | null>(null);
    const [showBicycle, setShowBicycle] = useState(false);
    const [showTerrain, setShowTerrain] = useState(false);

    const initializeMap = useCallback(() => {
        if (!mapRef.current) return;

        const { kakao } = window;
        const latLng = new kakao.maps.LatLng(lat, lng);

        const map = new kakao.maps.Map(mapRef.current, {
            center: latLng,
            level: 5,
            scrollwheel: false,
        });
        mapInstance.current = map;

        const markerImage = new kakao.maps.MarkerImage(
            '/icon/marker.svg',
            new kakao.maps.Size(80, 80),
            { offset: new kakao.maps.Point(40, 78) },
        );

        const marker = new kakao.maps.Marker({
            position: latLng,
            image: markerImage,
        });
        marker.setMap(map);

        if (showBicycle) {
            map.addOverlayMapTypeId(kakao.maps.MapTypeId.BICYCLE);
        }
        if (showTerrain) {
            map.addOverlayMapTypeId(kakao.maps.MapTypeId.TERRAIN);
        }
    }, [lat, lng, showBicycle, showTerrain]);

    useEffect(() => {
        if (!lat || !lng) return;

        if (window.kakao && window.kakao.maps) {
            initializeMap();
            return;
        }

        const script = document.createElement('script');
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY}&autoload=false&libraries=services`;
        script.onload = () => {
            window.kakao.maps.load(initializeMap);
        };
        script.onerror = () => {
            console.error('카카오 SDK 로드 실패');
        };
        document.head.appendChild(script);
    }, [initializeMap, lat, lng]);

    // 지도 위 오버레이 적용 (토글 후 동작)
    useEffect(() => {
        const map = mapInstance.current;
        if (!map || !window.kakao || !window.kakao.maps) return;

        if (showBicycle) {
            map.addOverlayMapTypeId(window.kakao.maps.MapTypeId.BICYCLE);
        } else {
            map.removeOverlayMapTypeId(window.kakao.maps.MapTypeId.BICYCLE);
        }

        if (showTerrain) {
            map.addOverlayMapTypeId(window.kakao.maps.MapTypeId.TERRAIN);
        } else {
            map.removeOverlayMapTypeId(window.kakao.maps.MapTypeId.TERRAIN);
        }
    }, [showBicycle, showTerrain]);

    return (
        <div className="relative h-[400px] w-full rounded-[12px] border">
            <div ref={mapRef} className="h-full w-full" />

            {/* 토글 버튼 */}
            <div className="absolute top-2 right-2 z-10 flex flex-col gap-2">
                <button
                    type="button"
                    onClick={() => setShowBicycle((prev) => !prev)}
                    className={`flex items-center gap-1 rounded border px-2 py-1 text-sm ${showBicycle ? 'bg-sky-blue' : 'bg-white dark:bg-black'}`}
                >
                    <BikeIcon size={20} />
                </button>
                <button
                    type="button"
                    onClick={() => setShowTerrain((prev) => !prev)}
                    className={`flex items-center gap-1 rounded border px-2 py-1 text-sm ${showTerrain ? 'bg-sky-blue' : 'bg-white dark:bg-black'}`}
                >
                    <MountainIcon size={20} />
                </button>
            </div>
        </div>
    );
}
