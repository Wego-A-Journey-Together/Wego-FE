export {};

declare global {
    interface Window {
        kakao: KakaoNamespace;
    }

    namespace kakao {
        namespace maps {
            type MapTypeId = 'BICYCLE' | 'TERRAIN';

            class LatLng {
                constructor(lat: number, lng: number);

                getLat(): number;

                getLng(): number;
            }

            class Map {
                constructor(
                    container: HTMLElement,
                    options: {
                        center: LatLng;
                        level: number;
                        scrollwheel?: boolean;
                    },
                );

                setCenter(latlng: LatLng): void;

                addOverlayMapTypeId(type: MapTypeId): void;

                removeOverlayMapTypeId(type: MapTypeId): void;
            }

            class Marker {
                constructor(options: { position: LatLng; image?: MarkerImage });

                setMap(map: Map | null): void;
            }

            class MarkerImage {
                constructor(
                    src: string,
                    size: Size,
                    options?: {
                        offset?: Point;
                    },
                );
            }

            class Size {
                constructor(width: number, height: number);
            }

            class Point {
                constructor(x: number, y: number);
            }

            function load(callback: () => void): void;

            const MapTypeId: {
                BICYCLE: MapTypeId;
                TERRAIN: MapTypeId;
            };
        }
    }
}
