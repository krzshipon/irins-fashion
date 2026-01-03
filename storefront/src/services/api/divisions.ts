// Bangladesh Divisions API
// These can be managed from admin later

export interface Division {
    id: string;
    name: string;
    nameBn: string;
}

// 8 Divisions of Bangladesh
export const MOCK_DIVISIONS: Division[] = [
    { id: 'dhaka', name: 'Dhaka', nameBn: 'ঢাকা' },
    { id: 'chittagong', name: 'Chittagong', nameBn: 'চট্টগ্রাম' },
    { id: 'rajshahi', name: 'Rajshahi', nameBn: 'রাজশাহী' },
    { id: 'khulna', name: 'Khulna', nameBn: 'খুলনা' },
    { id: 'barisal', name: 'Barisal', nameBn: 'বরিশাল' },
    { id: 'sylhet', name: 'Sylhet', nameBn: 'সিলেট' },
    { id: 'rangpur', name: 'Rangpur', nameBn: 'রংপুর' },
    { id: 'mymensingh', name: 'Mymensingh', nameBn: 'ময়মনসিংহ' },
];

export const getDivisions = async (): Promise<Division[]> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 100));

    // TODO: Replace with actual API call
    // const response = await fetch('/api/divisions');
    // return response.json();

    return MOCK_DIVISIONS;
};
