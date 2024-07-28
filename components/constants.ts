export const explanationItems = [
    { icon: '💓', url: '/icons/pulse.png', text: 'Pulse Check', relatedMarkers: ["Pulse Check"], yValue: 1 },
    { icon: '🩺', url: '/icons/lung-sounds.png', text: 'Lung Sounds', relatedMarkers: ["Lung Sounds"], yValue: 1.5 },
    { icon: '☢️', url: '/icons/x-ray.png', text: 'X-Ray', relatedMarkers: ["Order X-Ray"], yValue: 2 },
    { icon: '💉', url: '/icons/medication.png', text: 'Medication', relatedMarkers: ["Select Epinephrine", "Select Amiodarone"], yValue: 2.5 },
    { icon: '📈', url: '/icons/ekg.png', text: 'EKG', relatedMarkers: ["Order EKG"], yValue: 3 },
    { icon: '🌡️', url: '/icons/cool-down.png', text: 'Cool', relatedMarkers: ["Order Cooling"], yValue: 3.5 },
    { icon: '⚡', url: '/icons/shock.png', text: 'Shock', relatedMarkers: ["Shock", "Defib (UNsynchronized Shock) 200J", "SYNCHRONIZED Shock 100J"], yValue: 4 },
    { icon: '💨', url: '/icons/intubation.png', text: 'Intubate', relatedMarkers: ["Intubation", "Order Intubation"], yValue: 4.5 },
    { icon: '🧪', url: '/icons/lab-32.png', text: 'Labs', relatedMarkers: ["Labs", "Order new Labs UNAVAILABLE"], yValue: 5 },
    { icon: '✅', url: '/icons/check-lab-test.png', text: 'Check Lab Tests', relatedMarkers: ["Check Lab Tests"], yValue: 5.5 },
    { icon: '1️⃣', url: '/icons/syringe-on-arm.png', text: 'Insert Syringe on Right Hand', relatedMarkers: ["Insert Syringe on Right Hand"], yValue: 6 },
    { icon: '2️⃣', url: '/icons/insert-bag-mask.png', text: 'Insert Bag Mask', relatedMarkers: ["Insert Bag Mask"], yValue: 6.5 },
    { icon: '3️⃣', url: '/icons/perform-bag-mask.png', text: 'Perform Bag Mask Pump', relatedMarkers: ["Perform Bag Mask Pump"], yValue: 7 },
];

export const icons = explanationItems.reduce((acc, item) => {
    item.relatedMarkers.forEach(marker => {
        if (!acc[marker]) {
            acc[marker] = { unicode: '', image: '', name: '' };
        }
        acc[marker].unicode = item.icon;
        acc[marker].image = item.url;
        acc[marker].name = marker;
    });
    return acc;
}, {} as { [key: string]: { unicode: string, image: string, name: string } });

export const yValues = explanationItems.reduce((acc, item) => {
    item.relatedMarkers.forEach(marker => {
        acc[marker] = item.yValue;
    });
    return acc;
}, {} as { [key: string]: number });

export const phaseColors = [
    '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728',
    '#9467bd', '#8c564b', '#e377c2', '#7f7f7f',
    '#bcbd22', '#17becf'
];

export function getIcon(subAction: string): { unicode: string, image: string, name: string } {
    return icons[subAction] || { unicode: '', image: '', name: '' };
}
