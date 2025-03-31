'use client';

import { BikeIcon, MountainIcon } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

const KAKAO_REST_API_KEY = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY!;

export type Place = {
    id: string;
    place_name: string;
    address_name: string;
    road_address_name?: string;
    x: string;
    y: string;
};

type Props = {
    keyword: string;
    onSelectPlace: (place: {
        placeName: string;
        lat: number;
        lng: number;
    }) => void;
    onFixKeyword: (fixed: string) => void;
};

export default function KakaoKeywordSearch({
    keyword,
    onSelectPlace,
    onFixKeyword,
}: Props) {
    const [places, setPlaces] = useState<Place[]>([]);
    const [showBicycle, setShowBicycle] = useState(false);
    const [showTerrain, setShowTerrain] = useState(false);
    const [selected, setSelected] = useState<Place | null>(null);
    const [hasSearched, setHasSearched] = useState(false);
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<kakao.maps.Map | null>(null);
    const markerRef = useRef<kakao.maps.Marker | null>(null);

    // 지도 초기화 함수
    const initializeMap = useCallback(() => {
        if (!selected || !mapRef.current) return;

        const { kakao } = window;
        const latLng = new kakao.maps.LatLng(+selected.y, +selected.x);

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
        markerRef.current = marker;

        if (showBicycle) {
            map.addOverlayMapTypeId(kakao.maps.MapTypeId.BICYCLE);
        }
        if (showTerrain) {
            map.addOverlayMapTypeId(kakao.maps.MapTypeId.TERRAIN);
        }
    }, [selected, showBicycle, showTerrain]);

    // 카카오맵 스크립트 로드
    useEffect(() => {
        if (!selected) return;

        // 이미 스크립트가 로드되어 있는지 확인
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
    }, [initializeMap, selected]);

    // 자전거, 지형 레이어 토글 시 적용
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

    // 키워드 검색
    useEffect(() => {
        if (!keyword) return;
        const fetchPlaces = async () => {
            try {
                const res = await fetch(
                    `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(keyword)}`,
                    {
                        headers: {
                            Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
                        },
                    },
                );
                const data = await res.json();
                setHasSearched(true);
                if (
                    !data.documents ||
                    !Array.isArray(data.documents) ||
                    data.documents.length === 0
                ) {
                    setPlaces([]);
                    return;
                }
                setPlaces(data.documents);
            } catch (err) {
                console.error('API 요청 실패:', err);
                setHasSearched(true);
                setPlaces([]);
            }
        };

        void fetchPlaces();
    }, [keyword]);

    // 장소 선택 처리
    const handleSelect = (place: Place) => {
        setSelected(place);
        setPlaces([]); // 검색 결과 숨기기
        onSelectPlace({
            placeName: place.place_name,
            lat: +place.y,
            lng: +place.x,
        });
        onFixKeyword(place.place_name);
    };

    return (
        <>
            {/* 검색 결과 목록 (드롭다운 형태) */}
            {places.length > 0 && (
                <div className="absolute z-20 w-full rounded border bg-white shadow-lg dark:bg-neutral-700">
                    <ul className="max-h-60 overflow-auto">
                        {places.map((place) => (
                            <li
                                key={place.id}
                                className="cursor-pointer border-b p-2 hover:bg-gray-100"
                                onClick={() => handleSelect(place)}
                            >
                                <strong>{place.place_name}</strong>
                                <div className="text-sm text-gray-600">
                                    {place.address_name}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* "검색 결과 없음" 메시지 */}
            {hasSearched && places.length === 0 && !selected && (
                <div className="mt-2 bg-white text-sm text-gray-500 dark:bg-neutral-700">
                    검색 결과가 없습니다.
                </div>
            )}

            {/* 지도 컨테이너 - 선택된 경우에만 표시 */}
            {selected && (
                <div className="mt-4 bg-white dark:bg-neutral-700">
                    <div className="absolute top-2 left-2 z-10 rounded bg-white/80 px-3 py-2 text-sm text-gray-800 shadow dark:bg-neutral-600/80">
                        <div className="text-sky-blue text-lg font-semibold">
                            {selected.place_name}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-100">
                            {selected.road_address_name ||
                                selected.address_name}
                        </div>
                    </div>
                    <div
                        ref={mapRef}
                        id="map"
                        className="relative h-[400px] w-full rounded border shadow"
                    >
                        {/* 지도 컨트롤 버튼 */}
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
                </div>
            )}
        </>
    );
}
