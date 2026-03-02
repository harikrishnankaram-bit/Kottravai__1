import { useState, useEffect, useCallback } from 'react';

interface ShippingData {
    charge: number;
    remaining: number;
    isFree: boolean;
    threshold: number;
    zoneName: string;
    loading: boolean;
    error: string | null;
}

/**
 * Custom hook for dynamic zone-based shipping calculations.
 * Interacts with the secure backend authority to fetch shipping rules.
 * 
 * @param cartTotal - Subtotal after discounts
 * @param selectedState - Customer's delivery state
 */
export const useShipping = (cartTotal: number, selectedState: string) => {
    const [shippingData, setShippingData] = useState<ShippingData>({
        charge: 0,
        remaining: 0,
        isFree: false,
        threshold: 0,
        zoneName: '',
        loading: false,
        error: null
    });

    const calculateShipping = useCallback(async () => {
        if (!selectedState || cartTotal === undefined) return;

        setShippingData(prev => ({ ...prev, loading: true, error: null }));

        try {
            const apiUrl = import.meta.env.VITE_API_URL || '';
            const response = await fetch(`${apiUrl}/shipping/calculate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    state: selectedState,
                    cartTotal
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to calculate shipping');
            }

            const data = await response.json();

            setShippingData({
                charge: data.shippingFee,
                remaining: data.remainingForFreeShipping,
                isFree: data.isFreeShipping,
                threshold: data.threshold,
                zoneName: data.zoneName,
                loading: false,
                error: null
            });
        } catch (err: any) {
            console.error('Shipping Hook Error:', err);
            setShippingData(prev => ({
                ...prev,
                loading: false,
                error: err.message,
                // Fallback UI values to prevent crashes
                charge: 125,
                threshold: 999
            }));
        }
    }, [cartTotal, selectedState]);

    useEffect(() => {
        // Debounce to prevent excessive API calls during typing/selection
        const timer = setTimeout(() => {
            calculateShipping();
        }, 300);

        return () => clearTimeout(timer);
    }, [calculateShipping]);

    return shippingData;
};
