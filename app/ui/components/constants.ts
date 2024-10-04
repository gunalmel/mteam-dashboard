export const STAGE_NAME_MAP: Record<string, string> = {
  'V-Tach 2D': 'V Tach WITH Pulse',
  'V-Tach 2A.1': 'V Tach NO Pulse.A',
  'V-Tach 2B.1': 'V Tach NO Pulse.B',
  'Asystole 1D No.1': 'Asystole',
  'V-Fib 4C.1 - AMIO': 'VF -V FIB',
  'ROSC 5B - Stemi': 'ROSC'
};

export const explanationItems = [
    { icon: '💓', url: '/icons/pulse.png', text: 'Pulse Check', relatedMarkers: ['Pulse Check','pulse_check'], yValue: 1 },
    { icon: '⚡', url: '/icons/synchronized-shock.png', text: 'SYNCHRONIZED Shock', relatedMarkers: ['SYNCHRONIZED Shock 100J','SYNCHRONIZED Shock 175J', 'SYNCHRONIZED Shock 200J', 'defib<149_sync_or_unsync'], yValue: 1.5 },
    { icon: '⚡', url: '/icons/unsynchronized-shock.png', text: 'Defib (UNsynchronized Shock)', relatedMarkers: ['Defib (UNsynchronized Shock) 200J','unsync_defib_150+', 'Defib (UNsynchronized Shock) 300J'], yValue: 2 },
    { icon: '💉', url: '/icons/medication.png', text: 'Medication', relatedMarkers: ['Select Adenosine', 'Select Calcium', 'Select Epinephrine', 'Select Amiodarone', 'Select Lidocaine', 'Epi','Amio_or_Lidocaine','glucose_anytime','chestneedle_thora_anytime','ROSC_Fentanyl_or_Propofol'], yValue: 2.5 },
    { icon: '1️⃣', url: '/icons/syringe-on-arm.png', text: 'Insert Syringe on Right Hand', relatedMarkers: ['Insert Syringe on Right Hand'], yValue: 3 },
    { icon: '💉', url: '/icons/medication.png', text: 'Ask About IV Access', relatedMarkers: ['Ask About IV Access'], yValue: 3.5 },
    { icon: '☢️', url: '/icons/x-ray.png', text: 'Order Chest X-ray', relatedMarkers: ['Order X-Ray','Order Chest X-ray','chest_xray'], yValue: 4 },
    { icon: '🧪', url: '/icons/lab-32.png', text: 'Order new Labs UNAVAILABLE', relatedMarkers: ['Order new Labs UNAVAILABLE', 'labcheck_anytime'], yValue: 4.5 },
    { icon: '📈', url: '/icons/ekg.png', text: 'Order EKG', relatedMarkers: ['Order EKG','EKG'], yValue: 5 },
    { icon: '🫀', url: '/icons/synchronized-shock.png', text: 'Order Pericardiocentesis', relatedMarkers: ['Order Pericardiocentesis','heartneedle_pericard_anytime'], yValue: 5.5 },
    { icon: '🔬', url: '/icons/synchronized-shock.png', text: 'Order Ultrasound', relatedMarkers: ['Order Ultrasound','ultrasound_FAST_anytime'], yValue: 6 },
    { icon: '📖', url: '/icons/synchronized-shock.png', text: 'View Cardiac Arrest Guidelines', relatedMarkers: ['View Cardiac Arrest Guidelines'], yValue: 6.5 },
    { icon: '🌡️', url: '/icons/cool-down.png', text: 'Order Cooling', relatedMarkers: ['Order Cooling', 'ROSC_cool_patient'], yValue: 7 },
    { icon: '💨', url: '/icons/intubation.png', text: 'Order Intubation', relatedMarkers: ['Intubation', 'Order Intubation', 'intubate_anytime'], yValue: 7.5 },
    { icon: '💨', url: '/icons/intubation.png', text: 'Measure Glucose Level', relatedMarkers: ['Measure Glucose Level','bipap_NIV_anytime'], yValue: 8 },
    { icon: '3️⃣', url: '/icons/perform-bag-mask.png', text: 'Perform Bag Mask Pump', relatedMarkers: ['Perform Bag Mask Pump'], yValue: 8.5 },
    { icon: '🩺', url: '/icons/lung-sounds.png', text: 'Lung Sounds', relatedMarkers: ['Lung Sounds', 'lunglisten_anytime'], yValue: 9 },
    { icon: '🩺', url: '/icons/lung-sounds.png', text: 'Insert Lactated Ringers (1 Liter)', relatedMarkers: ['Insert Lactated Ringers (1 Liter)'], yValue: 9.5 },
    { icon: '2️⃣', url: '/icons/insert-bag-mask.png', text: 'Insert Bag Mask', relatedMarkers: ['Insert Bag Mask'], yValue: 10 },
    { icon: '✅', url: '/icons/check-lab-test.png', text: 'Check Lab Tests', relatedMarkers: ['Check Lab Tests'], yValue: 10.5 },
    { icon: '❹', url: '/icons/lung-sounds.png', text: 'CPR Should be performed', relatedMarkers: ['CPR_perform_>1Pump'], yValue: 11 }
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
}, {} as Record<string, { unicode: string, image: string, name: string }>);

export const yValues = explanationItems.reduce((acc, item) => {
    item.relatedMarkers.forEach(marker => {
        acc[marker] = item.yValue;
    });
    return acc;
}, {} as Record<string, number>);

export const stageColors = [
    '#1f77b4', '#d62728', '#2ca02c', '#8c564b',
    '#9467bd', '#ff7f0e', '#e377c2', '#7f7f7f',
    '#bcbd22', '#17becf'
];

/**
 *
 * @param subAction
 */
export function getIcon(subAction: string): { unicode: string; image: string; name: string } {
    const icon = icons[subAction];

    if (!icon) {
        // console.error(`Icon not found for subAction: ${subAction} in explanationItems`);
        return { unicode: 'x', image: '/icons/not-found.png', name: 'not found' };
    }

    return icon;
}
