import { useState, useEffect } from 'react';

export const useCarrierPreference = () => {
    const [preferredCarrier, setPreferredCarrier] = useState<string | null>(() => {
        return localStorage.getItem('xeta_preferred_carrier');
    });

    const savePreference = (carrier: string) => {
        localStorage.setItem('xeta_preferred_carrier', carrier);
        setPreferredCarrier(carrier);
    };

    const clearPreference = () => {
        localStorage.removeItem('xeta_preferred_carrier');
        setPreferredCarrier(null);
    };

    return { preferredCarrier, savePreference, clearPreference };
};
