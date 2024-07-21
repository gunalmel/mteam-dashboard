// constants.ts
export const explanationItems = [
    { icon: '💓', text: 'Pulse Check', relatedMarkers: ["Pulse Check"] },
    { icon: '🩺', text: 'Lung Sounds', relatedMarkers: ["Lung Sounds"] },
    { icon: '☢️', text: 'X-Ray', relatedMarkers: ["Order X-Ray"] },
    { icon: '💉', text: 'Medication', relatedMarkers: ["Select Epinephrine", "Select Amiodarone"] },
    { icon: '📈', text: 'EKG', relatedMarkers: ["Order EKG"] },
    { icon: '🌡️', text: 'Cool', relatedMarkers: ["Order Cooling"] },
    { icon: '⚡', text: 'Shock', relatedMarkers: ["Shock", "Defib (UNsynchronized Shock) 200J", "SYNCHRONIZED Shock 100J"] },
    { icon: '💨', text: 'Intubate', relatedMarkers: ["Intubation", "Order Intubation"] },
    { icon: '🧪', text: 'Labs', relatedMarkers: ["Labs", "Order new Labs UNAVAILABLE"] },
    { icon: '✅', text: 'Check Lab Tests', relatedMarkers: ["Check Lab Tests"] },
    { icon: '1️⃣', text: 'Insert Syringe on Right Hand', relatedMarkers: ["Insert Syringe on Right Hand"] },
    { icon: '2️⃣', text: 'Insert Bag Mask', relatedMarkers: ["Insert Bag Mask"] },
    { icon: '3️⃣', text: 'Perform Bag Mask Pump', relatedMarkers: ["Perform Bag Mask Pump"] },
];

export const icons = explanationItems.reduce((acc, item) => {
    item.relatedMarkers.forEach(marker => {
        acc[marker] = item.icon;
    });
    return acc;
}, {} as { [key: string]: string });
