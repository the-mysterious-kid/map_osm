import { useEffect, useRef, useState } from 'react';

type Coord = [number, number]; // [lng, lat]
type LatLng = { lat: number; lng: number };

export function useNavigationAnimation(route: Coord[], speed = 1000) {
    const [markerPosition, setMarkerPosition] = useState<LatLng | null>(null);
    const indexRef = useRef(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!route || route.length < 2) return;

        indexRef.current = 0;
        setMarkerPosition({ lat: route[0][1], lng: route[0][0] });

        intervalRef.current = setInterval(() => {
            const i = indexRef.current;
            if (i >= route.length - 1) {
                clearInterval(intervalRef.current!);
                return;
            }

            const [lon, lat] = route[i + 1];
            setMarkerPosition({ lat, lng: lon });
            indexRef.current++;
        }, speed);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [route]);

    return { markerPosition };
}
