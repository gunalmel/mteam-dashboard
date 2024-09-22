// export const explanationItems = [
//     { icon: '💓', url: '/icons/pulse.png', text: 'Pulse Check', relatedMarkers: ["Pulse Check"], yValue: 1 },
//     { icon: '🩺', url: '/icons/lung-sounds.png', text: 'Lung Sounds', relatedMarkers: ["Lung Sounds"], yValue: 1.5 },
//     { icon: '☢️', url: '/icons/x-ray.png', text: 'X-Ray', relatedMarkers: ["Order X-Ray"], yValue: 2 },
//     { icon: '💉', url: '/icons/medication.png', text: 'Medication', relatedMarkers: ["Select Epinephrine", "Select Amiodarone"], yValue: 2.5 },
//     { icon: '📈', url: '/icons/ekg.png', text: 'EKG', relatedMarkers: ["Order EKG"], yValue: 3 },
//     { icon: '🌡️', url: '/icons/cool-down.png', text: 'Cool', relatedMarkers: ["Order Cooling"], yValue: 3.5 },
//     { icon: '⚡', url: '/icons/shock.png', text: 'Shock', relatedMarkers: ["Shock", "Defib (UNsynchronized Shock) 200J", "SYNCHRONIZED Shock 100J"], yValue: 4 },
//     { icon: '💨', url: '/icons/intubation.png', text: 'Intubate', relatedMarkers: ["Intubation", "Order Intubation"], yValue: 4.5 },
//     { icon: '🧪', url: '/icons/lab-32.png', text: 'Labs', relatedMarkers: ["Labs", "Order new Labs UNAVAILABLE"], yValue: 5 },
//     { icon: '✅', url: '/icons/check-lab-test.png', text: 'Check Lab Tests', relatedMarkers: ["Check Lab Tests"], yValue: 5.5 },
//     { icon: '1️⃣', url: '/icons/syringe-on-arm.png', text: 'Insert Syringe on Right Hand', relatedMarkers: ["Insert Syringe on Right Hand"], yValue: 6 },
//     { icon: '2️⃣', url: '/icons/insert-bag-mask.png', text: 'Insert Bag Mask', relatedMarkers: ["Insert Bag Mask"], yValue: 6.5 },
//     { icon: '3️⃣', url: '/icons/perform-bag-mask.png', text: 'Perform Bag Mask Pump', relatedMarkers: ["Perform Bag Mask Pump"], yValue: 7 }, 
//     { icon: 'X', url: '/icons/not-found.png', text: 'Not Found!', relatedMarkers: ["Not Found!"], yValue: 7.5 }, 
// ];


// TODO: update this with new sub actions icons and image urls
export const explanationItems = [
    { icon: '💓', url: '/icons/pulse.png', text: 'Pulse Check', relatedMarkers: ["Pulse Check"], yValue: 1 },
    { icon: '⚡', url: '/icons/shock.png', text: 'SYNCHRONIZED Shock 175J', relatedMarkers: ["SYNCHRONIZED Shock 175J"], yValue: 1.5 },
    { icon: '⚡', url: '/icons/shock.png', text: 'SYNCHRONIZED Shock 100J', relatedMarkers: ["SYNCHRONIZED Shock 100J"], yValue: 1.6 },
    { icon: '⚡', url: '/icons/shock.png', text: 'SYNCHRONIZED Shock 200J', relatedMarkers: ["SYNCHRONIZED Shock 200J"], yValue: 1.7 },
    { icon: '⚡', url: '/icons/shock.png', text: 'Defib (UNsynchronized Shock) 200J', relatedMarkers: ["Defib (UNsynchronized Shock) 200J"], yValue: 2 },
    { icon: '💉', url: '/icons/medication.png', text: 'Select Epinephrine', relatedMarkers: ["Select Epinephrine"], yValue: 2.5 },
    { icon: '💉', url: '/icons/medication.png', text: 'Select Adenosine', relatedMarkers: ["Select Adenosine"], yValue: 2.6 },
    { icon: '1️⃣', url: '/icons/syringe-on-arm.png', text: 'Insert Syringe on Right Hand', relatedMarkers: ["Insert Syringe on Right Hand"], yValue: 3 },
    { icon: '💉', url: '/icons/medication.png', text: 'Ask About IV Access', relatedMarkers: ["Ask About IV Access"], yValue: 3.5 },
    { icon: '☢️', url: '/icons/x-ray.png', text: 'Order Chest X-ray', relatedMarkers: ["Order Chest X-ray"], yValue: 4 },
    { icon: '🧪', url: '/icons/lab-32.png', text: 'Order new Labs UNAVAILABLE', relatedMarkers: ["Order new Labs UNAVAILABLE"], yValue: 4.5 },
    { icon: '📈', url: '/icons/ekg.png', text: 'Order EKG', relatedMarkers: ["Order EKG"], yValue: 5 },
    { icon: '🫀', url: '/icons/shock.png', text: 'Order Pericardiocentesis', relatedMarkers: ["Order Pericardiocentesis"], yValue: 5.5 },
    { icon: '🔬', url: '/icons/shock.png', text: 'Order Ultrasound', relatedMarkers: ["Order Ultrasound"], yValue: 6 },
    { icon: '📖', url: '/icons/shock.png', text: 'View Cardiac Arrest Guidelines', relatedMarkers: ["View Cardiac Arrest Guidelines"], yValue: 6.5 },
    { icon: '🌡️', url: '/icons/cool-down.png', text: 'Order Cooling', relatedMarkers: ["Order Cooling"], yValue: 7 },
    { icon: '💨', url: '/icons/intubation.png', text: 'Order Intubation', relatedMarkers: ["Order Intubation"], yValue: 7.5 },
    { icon: '💨', url: '/icons/intubation.png', text: 'Measure Glucose Level', relatedMarkers: ["Measure Glucose Level"], yValue: 8 },
    { icon: '3️⃣', url: '/icons/perform-bag-mask.png', text: 'Perform Bag Mask Pump', relatedMarkers: ["Perform Bag Mask Pump"], yValue: 8.5 },
    { icon: '🩺', url: '/icons/lung-sounds.png', text: 'Lung Sounds', relatedMarkers: ["Lung Sounds"], yValue: 9 },
    { icon: '🩺', url: '/icons/lung-sounds.png', text: 'Insert Lactated Ringers (1 Liter)', relatedMarkers: ["Insert Lactated Ringers (1 Liter)"], yValue: 9.5 },
    { icon: '2️⃣', url: '/icons/insert-bag-mask.png', text: 'Insert Bag Mask', relatedMarkers: ["Insert Bag Mask"], yValue: 10 },
    { icon: '✅', url: '/icons/check-lab-test.png', text: 'Check Lab Tests', relatedMarkers: ["Check Lab Tests"], yValue: 10.5 }
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
    '#1f77b4', '#d62728', '#2ca02c', '#8c564b',
    '#9467bd', '#ff7f0e', '#e377c2', '#7f7f7f',
    '#bcbd22', '#17becf'
];

export function getIcon(subAction: string): { unicode: string; image: string; name: string } {
    const icon = icons[subAction];

    if (!icon) {
        console.error(`Icon not found for subAction: ${subAction} in explanationItems`);
        return { unicode: 'x', image: '/icons/not-found.png', name: 'not found' };
    }

    return icon;
}
