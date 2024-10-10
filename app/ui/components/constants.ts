import {ActionImage} from '@/types';

export const STAGE_NAME_MAP: Record<string, string> = {
  'V-Tach 2D': 'V Tach WITH Pulse',
  'V-Tach 2A.1': 'V Tach NO Pulse.A',
  'V-Tach 2B.1': 'V Tach NO Pulse.B',
  'Asystole 1D No.1': 'Asystole',
  'V-Fib 4C.1 - AMIO': 'VF -V FIB',
  'ROSC 5B - Stemi': 'ROSC'
};

export const ACTION_GROUP_MAP: Record<string, {url: string; actions: string[]; y: number}> = {
  'Pulse Check': {url: '/icons/pulse.png', actions: ['Pulse Check', 'pulse_check'], y: 1},
   'Synchronized Shock': {
      url: '/icons/synchronized-shock.png',
      actions: [
        'SYNCHRONIZED Shock 100J',
        'SYNCHRONIZED Shock 175J',
        'SYNCHRONIZED Shock 200J',
        'defib<149_sync_or_unsync'
      ],
      y: 1.5
    },
  'Defib (Unsynchronized Shock)': {
      url: '/icons/unsynchronized-shock.png',
      actions: ['Defib (UNsynchronized Shock) 200J', 'unsync_defib_150+', 'Defib (UNsynchronized Shock) 300J'],
      y: 2
    },
    'Medication': {
      url: '/icons/medication.png',
      actions: [
        'Select Adenosine',
        'Select Calcium',
        'Select Epinephrine',
        'Select Amiodarone',
        'Select Lidocaine',
        'Epi',
        'Amio_or_Lidocaine',
        'glucose_anytime',
        'chestneedle_thora_anytime',
        'ROSC_Fentanyl_or_Propofol'
      ],
      y: 2.5
  },
    'Insert Syringe on Right Hand': {
      url: '/icons/inject-syringe-on-right-hand.png',
      actions: ['Insert Syringe on Right Hand'],
      y: 3
  },
  'Ask About IV Access': {url: '/icons/intravenous-access.png', actions: ['Ask About IV Access'], y: 3.5},
  'Order Chest X-ray': {url: '/icons/x-ray.png', actions: ['Order X-Ray', 'Order Chest X-ray', 'chest_xray'], y: 4},
    'Order new Labs UNAVAILABLE': {
      url: '/icons/lab.png',
      actions: ['Order new Labs UNAVAILABLE', 'labcheck_anytime'],
      y: 4.5
  },
  'Order EKG': {url: '/icons/ekg.png', actions: ['Order EKG', 'EKG'], y: 5},
    'Order Pericardiocentesis': {
      url: '/icons/pericardiocentesis.png',
      actions: ['Order Pericardiocentesis', 'heartneedle_pericard_anytime'],
      y: 5.5
  },
  'Order Ultrasound': {url: '/icons/ultrasound.png', actions: ['Order Ultrasound', 'ultrasound_FAST_anytime'], y: 6},
    'View Cardiac Arrest Guidelines': {
      url: '/icons/cardiac-arrest.png',
      actions: ['View Cardiac Arrest Guidelines'],
      y: 6.5
  },
  'Order Cooling': {url: '/icons/cool-down.png', actions: ['Order Cooling', 'ROSC_cool_patient'], y: 7},
    'Order Intubation': {
      url: '/icons/intubation.png',
      actions: ['Intubation', 'Order Intubation', 'intubate_anytime'],
      y: 7.5
  },
  'Measure Glucose Level': {url: '/icons//icons/sugar-blood-level.png', actions: ['Measure Glucose Level'], y: 8},
  'Perform Bag Mask Pump': {url: '/icons/perform-bag-mask.png', actions: ['Perform Bag Mask Pump'], y: 8.5},
  'Lung Sounds': {url: '/icons/lung-sounds.png', actions: ['Lung Sounds', 'lunglisten_anytime'], y: 9},
    'Insert Lactated Ringers (1 Liter)': {
      url: '/icons/intravenous-access.png',
      actions: ['Insert Lactated Ringers (1 Liter)'],
      y: 9.5
  },
  'Insert Bag Mask': {url: '/icons/insert-bag-mask.png', actions: ['Insert Bag Mask'], y: 10},
  'Check Lab Tests': {url: '/icons/check-lab-test.png', actions: ['Check Lab Tests'], y: 10.5},
  'CPR Should be performed': {url: '/icons/cpr.png', actions: ['CPR_perform_>1Pump'], y: 11},
  'bipap_NIV_anytime': {url: '/icons//icons/bipap-niv.png', actions: ['bipap_NIV_anytime'], y: 11.5}
  };

type groupMapValues = typeof ACTION_GROUP_MAP[keyof typeof ACTION_GROUP_MAP];
class ActionsDictionary{
  readonly #dictionary = {} as Record<string, ActionImage>;
  #yMax = 0;
  add(group: string, url:groupMapValues['url'], actions:groupMapValues['actions'], y:groupMapValues['y']){
    actions.forEach(action=>{
      this.#dictionary[action]={name:action, url, group, y};
    });
    this.#yMax = this.#yMax>y?this.#yMax:y;
    return this;
  }
  get(action: string){
    return this.#dictionary[action];
  }
  get yMax(): number {
    return this.#yMax;
  }
}

export const actionsDictionary =  Object.entries(ACTION_GROUP_MAP).reduce((acc, [group,actions])=>{
  return acc.add(group, actions.url, actions.actions, actions.y);
},new ActionsDictionary());

export const stageColors = [
    '#1f77b4', '#d62728', '#2ca02c', '#8c564b',
    '#9467bd', '#ff7f0e', '#e377c2', '#7f7f7f',
    '#bcbd22', '#17becf'
];

export function getIcon(action: string): ActionImage {
    const icon = actionsDictionary.get(action);

    if (!icon) {
        // console.error(`Icon not found for action: ${action} in explanationItems`);
        return { url: '/icons/not-found.png', name: 'not found', group:'', y:0 };
    }

    return icon;
}
