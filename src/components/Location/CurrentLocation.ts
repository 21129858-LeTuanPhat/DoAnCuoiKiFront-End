import { useState } from 'react';

export function useCurrentLocation() {
    const [location, setLocation] = useState<any>('');
    const [error, setError] = useState<string>('');
    const getLocation = () => {
        if (!navigator.geolocation) {
            setError('Trình duyệt không hỗ trợ GPS');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setLocation(`${pos.coords.latitude},${pos.coords.longitude}`);
            },
            (err) => setError(err.message),
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    };
    console.log('location hiện tại', location);

    return { location, error, getLocation };
}
