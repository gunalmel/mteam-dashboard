export const explanationItems = [
    { icon: '💓', text: 'Pulse Check', relatedMarkers: ["Pulse Check"], yValue: 1 },
    { icon: '🩺', text: 'Lung Sounds', relatedMarkers: ["Lung Sounds"], yValue: 1.5 },
    { icon: '☢️', text: 'X-Ray', relatedMarkers: ["Order X-Ray"], yValue: 2 },
    { icon: '💉', text: 'Medication', relatedMarkers: ["Select Epinephrine", "Select Amiodarone"], yValue: 2.5 },
    { icon: '📈', text: 'EKG', relatedMarkers: ["Order EKG"], yValue: 3 },
    { icon: '🌡️', text: 'Cool', relatedMarkers: ["Order Cooling"], yValue: 3.5 },
    { icon: '⚡', text: 'Shock', relatedMarkers: ["Shock", "Defib (UNsynchronized Shock) 200J", "SYNCHRONIZED Shock 100J"], yValue: 4 },
    { icon: '💨', text: 'Intubate', relatedMarkers: ["Intubation", "Order Intubation"], yValue: 4.5 },
    { icon: '🧪', text: 'Labs', relatedMarkers: ["Labs", "Order new Labs UNAVAILABLE"], yValue: 5 },
    { icon: '✅', text: 'Check Lab Tests', relatedMarkers: ["Check Lab Tests"], yValue: 5.5 },
    { icon: '1️⃣', text: 'Insert Syringe on Right Hand', relatedMarkers: ["Insert Syringe on Right Hand"], yValue: 6 },
    { icon: '2️⃣', text: 'Insert Bag Mask', relatedMarkers: ["Insert Bag Mask"], yValue: 6.5 },
    { icon: '3️⃣', text: 'Perform Bag Mask Pump', relatedMarkers: ["Perform Bag Mask Pump"], yValue: 7 },
];

export const icons = explanationItems.reduce((acc, item) => {
    item.relatedMarkers.forEach(marker => {
        acc[marker] = item.icon;
    });
    return acc;
}, {} as { [key: string]: string });

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
