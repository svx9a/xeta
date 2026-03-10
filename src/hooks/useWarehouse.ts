import { useState } from 'react';

export interface Warehouse {
    id: string;
    name: string;
    address: string;
    country: string;
}

export const useWarehouse = () => {
    const [defaultWarehouse] = useState<Warehouse>({
        id: 'wh_main',
        name: 'Bangkok Central Hub',
        address: '456 Rama IV Road, Pathum Wan, Bangkok 10330, Thailand',
        country: 'Thailand'
    });

    return { defaultWarehouse };
};
