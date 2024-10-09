import {findMaxValue} from '@/app/utils/helpers';

export const STAGE_NAME_MAP: Record<string, string> = {
  'V-Tach 2D': 'V Tach WITH Pulse',
  'V-Tach 2A.1': 'V Tach NO Pulse.A',
  'V-Tach 2B.1': 'V Tach NO Pulse.B',
  'Asystole 1D No.1': 'Asystole',
  'V-Fib 4C.1 - AMIO': 'VF -V FIB',
  'ROSC 5B - Stemi': 'ROSC'
};

export const explanationItems:{url:string, name:string, keys: string[], y:number}[] = [
    { url: '/icons/pulse.png', name: 'Pulse Check', keys: ['Pulse Check','pulse_check'], y: 1 },
    { url: '/icons/synchronized-shock.png', name: 'Synchronized Shock', keys: ['SYNCHRONIZED Shock 100J','SYNCHRONIZED Shock 175J', 'SYNCHRONIZED Shock 200J', 'defib<149_sync_or_unsync'], y: 1.5 },
    { url: '/icons/unsynchronized-shock.png', name: 'Defib (Unsynchronized Shock)', keys: ['Defib (UNsynchronized Shock) 200J','unsync_defib_150+', 'Defib (UNsynchronized Shock) 300J'], y: 2 },
    { url: '/icons/medication.png', name: 'Medication', keys: ['Select Adenosine', 'Select Calcium', 'Select Epinephrine', 'Select Amiodarone', 'Select Lidocaine', 'Epi','Amio_or_Lidocaine','glucose_anytime','chestneedle_thora_anytime','ROSC_Fentanyl_or_Propofol'], y: 2.5 },
    { url: '/icons/inject-syringe-on-right-hand.png', name: 'Insert Syringe on Right Hand', keys: ['Insert Syringe on Right Hand'], y: 3 },
    { url: '/icons/intravenous-access.png', name: 'Ask About IV Access', keys: ['Ask About IV Access'], y: 3.5 },
    { url: '/icons/x-ray.png', name: 'Order Chest X-ray', keys: ['Order X-Ray','Order Chest X-ray','chest_xray'], y: 4 },
    { url: '/icons/lab.png', name: 'Order new Labs UNAVAILABLE', keys: ['Order new Labs UNAVAILABLE', 'labcheck_anytime'], y: 4.5 },
    { url: '/icons/ekg.png', name: 'Order EKG', keys: ['Order EKG','EKG'], y: 5 },
    { url: '/icons/pericardiocentesis.png', name: 'Order Pericardiocentesis', keys: ['Order Pericardiocentesis','heartneedle_pericard_anytime'], y: 5.5 },
    { url: '/icons/ultrasound.png', name: 'Order Ultrasound', keys: ['Order Ultrasound','ultrasound_FAST_anytime'], y: 6 },
    { url: '/icons/cardiac-arrest.png', name: 'View Cardiac Arrest Guidelines', keys: ['View Cardiac Arrest Guidelines'], y: 6.5 },
    { url: '/icons/cool-down.png', name: 'Order Cooling', keys: ['Order Cooling', 'ROSC_cool_patient'], y: 7 },
    { url: '/icons/intubation.png', name: 'Order Intubation', keys: ['Intubation', 'Order Intubation', 'intubate_anytime'], y: 7.5 },
    { url: '/icons//icons/sugar-blood-level.png', name: 'Measure Glucose Level', keys: ['Measure Glucose Level'], y: 8 },
    { url: '/icons/perform-bag-mask.png', name: 'Perform Bag Mask Pump', keys: ['Perform Bag Mask Pump'], y: 8.5 },
    { url: '/icons/lung-sounds.png', name: 'Lung Sounds', keys: ['Lung Sounds', 'lunglisten_anytime'], y: 9 },
    { url: '/icons/intravenous-access.png', name: 'Insert Lactated Ringers (1 Liter)', keys: ['Insert Lactated Ringers (1 Liter)'], y: 9.5 },
    { url: '/icons/insert-bag-mask.png', name: 'Insert Bag Mask', keys: ['Insert Bag Mask'], y: 10 },
    { url: '/icons/check-lab-test.png', name: 'Check Lab Tests', keys: ['Check Lab Tests'], y: 10.5 },
    { url: '/icons/cpr.png', name: 'CPR Should be performed', keys: ['CPR_perform_>1Pump'], y: 11 },
    { url: '/icons//icons/bipap-niv.png', name: 'Measure Glucose Level', keys: ['bipap_NIV_anytime'], y: 11.5 },
];

export const yMaxActions = findMaxValue(explanationItems.map(item=>item.y));

export const icons = explanationItems.reduce((acc, item) => {
    item.keys.forEach((key) => {
        if (!acc[key]) {
            acc[key] = { url: '', name: '' };
        }
        acc[key].url = item.url;
        acc[key].name = key;
    });
    return acc;
}, {} as Record<string, { url: string, name: string }>);

export const yValues = explanationItems.reduce((acc, item) => {
    item.keys.forEach(marker => {
        acc[marker] = item.y;
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
export function getIcon(subAction: string): { url: string; name: string } {
    const icon = icons[subAction];

    if (!icon) {
        // console.error(`Icon not found for subAction: ${subAction} in explanationItems`);
        return { url: '/icons/not-found.png', name: 'not found' };
    }

    return icon;
}
