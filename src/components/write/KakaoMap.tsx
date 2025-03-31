'use client';

import { useEffect, useRef, useState } from 'react';

const KAKAO_REST_API_KEY = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY!;

declare global {
    interface Window {
        kakao: any;
    }
}

type Place = {
    id: string;
    place_name: string;
    address_name: string;
    x: string;
    y: string;
};

export default function KakaoKeywordSearch() {
    const [query, setQuery] = useState('');
    const [places, setPlaces] = useState<Place[]>([]);
    const [showBicycle, setShowBicycle] = useState(false);
    const [showTerrain, setShowTerrain] = useState(false);
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<any>(null);
    const markerRef = useRef<any>(null);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY}&autoload=false&libraries=services`;
        script.onload = () => {
            if (window.kakao && window.kakao.maps) {
                window.kakao.maps.load(() => {
                    const map = new window.kakao.maps.Map(mapRef.current, {
                        center: new window.kakao.maps.LatLng(37.5665, 126.978),
                        level: 3,
                    });
                    mapInstance.current = map;
                });
            } else {
                console.error('카카오 maps 객체를 찾을 수 없습니다.');
            }
        };
        script.onerror = () => {
            console.error('카카오 SDK 로드 실패');
        };
        document.head.appendChild(script);
    }, []);

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

    const handleSearch = async () => {
        try {
            const res = await fetch(
                `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(query)}`,
                {
                    headers: {
                        Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
                    },
                },
            );
            const data = await res.json();
            if (!data.documents || !Array.isArray(data.documents)) {
                console.error('검색 결과 없음 또는 오류 응답:', data);
                setPlaces([]);
                return;
            }
            setPlaces(data.documents);
        } catch (err) {
            console.error('API 요청 실패:', err);
            setPlaces([]);
        }
    };

    const handleSelect = (place: Place) => {
        if (!window.kakao || !window.kakao.maps) {
            console.error('kakao.maps 객체가 준비되지 않았습니다.');
            return;
        }

        const latLng = new window.kakao.maps.LatLng(+place.y, +place.x);

        if (mapInstance.current) {
            mapInstance.current.setCenter(latLng);

            if (markerRef.current) markerRef.current.setMap(null);

            const marker = new window.kakao.maps.Marker({ position: latLng });
            marker.setMap(mapInstance.current);
            markerRef.current = marker;
        }
    };

    return (
        <div className="space-y-4 p-4">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSearch();
                }}
                className="flex gap-2"
            >
                <input
                    type="text"
                    placeholder="여행 장소를 검색하세요"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1 rounded border p-2"
                />
                <button
                    type="submit"
                    className="rounded bg-blue-600 px-4 py-2 text-white"
                >
                    검색
                </button>
            </form>

            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={() => setShowBicycle((prev) => !prev)}
                    className={`rounded border px-3 py-1 ${showBicycle ? 'bg-green-200' : 'bg-white'}`}
                >
                    자전거 도로 보기
                </button>
                <button
                    type="button"
                    onClick={() => setShowTerrain((prev) => !prev)}
                    className={`rounded border px-3 py-1 ${showTerrain ? 'bg-yellow-200' : 'bg-white'}`}
                >
                    지형 정보 보기
                </button>
            </div>

            <ul className="space-y-2">
                {places.map((place) => (
                    <li
                        key={place.id}
                        className="cursor-pointer rounded border p-2 hover:bg-gray-100"
                        onClick={() => handleSelect(place)}
                    >
                        <strong>{place.place_name}</strong>
                        <div className="text-sm text-gray-600">
                            {place.address_name}
                        </div>
                    </li>
                ))}
            </ul>

            <div
                ref={mapRef}
                id="map"
                className="mt-4 h-[400px] w-full rounded border shadow"
            ></div>
        </div>
    );
}
