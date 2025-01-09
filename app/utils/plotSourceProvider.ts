interface DataSource {
  name: string;
  url: string | undefined;
}

interface CognitiveLoadData {
  teamLead: DataSource;
  average: DataSource;
  defib: DataSource;
  compressor: DataSource;
  airway: DataSource;
}

interface VisualAttentionData {
  teamLead: DataSource;
  defib: DataSource;
  compressor: DataSource;
  airway: DataSource;
}

interface SimulationData {
  video: DataSource;
  actions: DataSource;
  cognitiveLoad: CognitiveLoadData;
  visualAttention: VisualAttentionData;
}

type SimulationDataset = Record<string, SimulationData>;

const baseUrl = 'https://dl.dropboxusercontent.com/scl/fi';

const PlotsFileSource: SimulationDataset = {
  '09302024': {
    video: {
      name: 'Video',
      url: `${baseUrl}/gzpo2mer8tigrit3npjxv/timeline-multiplayer-09182024.mp4?rlkey=6sbj1ru1qze8mmf2xgww5q9tt&st=2gnlyx5i&dl=0`
    },
    actions: {
      name: 'Actions Data',
      url: `${baseUrl}/6os941r9qnk19nkd22415/timeline-multiplayer-09182024.csv?rlkey=4lpfpmkf62fnua597t7bh3p17&st=kgj7uu6l&dl=0`
    },
    cognitiveLoad: {
      teamLead: {
        name: 'Team Lead',
        url: `${baseUrl}/6lmdyuka085hdpakzp7kn/team_lead_cognitive_load.json?rlkey=fm7881olmj0uu7j3zf111ebpd&st=cxwrqgo2&dl=0`
      },
      average: {
        name: 'Average',
        url: `${baseUrl}/qnbk37u8b749v181c1kwt/average_cognitive_load.json?rlkey=cb82ggqrn6rqcvi1f055u92zq&st=9eto5ucj&dl=0`
      },
      defib: {
        name: 'Defibrillator',
        url: `${baseUrl}/nhbt6rd1mz6tpseuxtk1d/defib_cognitive_load.json?rlkey=urn8azmqecma6p2vq7n4mogfg&st=1r44lsx1&dl=0`
      },
      compressor: {
        name: 'Compressor',
        url: `${baseUrl}/dy8mxgddiy9zo7ilefhde/compressor_cognitive_load.json?rlkey=1zqdqaqkqchollucv258za1z6&st=2m59wrfl&dl=0`
      },
      airway: {
        name: 'Airway',
        url: `${baseUrl}/v39rhujeqde7pj3r57xlk/airway_cognitive_load.json?rlkey=79b0094va3d4n6teq6zn4ko11&st=3n5gf8ie&dl=0`
      }
    },
    visualAttention: {
      teamLead: {
        name: 'Team Lead',
        url: `${baseUrl}/ujv8zhqty08u2xmcb7mt9/team_lead_fixation_data.json?rlkey=ni6lwp5a6cx7ioe9ydr4uerxe&st=m90n3yjg&dl=0`
      },
      defib: {
        name: 'Defibrillator',
        url: `${baseUrl}/64rs4pjq7iyva4hceq553/defib_fixation_data.json?rlkey=3a22v8gqwym18iej2usarlmc2&st=t9kdd47x&dl=0`
      },
      compressor: {
        name: 'Compressor',
        url: `${baseUrl}/rnt4fk27e55xqmtgqdww5/cpr_fixation_data.json?rlkey=hdm0ara4on6it50dszif3ualx&st=khc7myuo&dl=0`
      },
      airway: {
        name: 'Airway',
        url: `${baseUrl}/natojy0easb7ckev55mgs/airway_fixation_data.json?rlkey=kqmpytb0i00xjrn8jy66arysq&st=u6amcn8x&dl=0`
      }
    }
  },
  '01092025 (invalid data)': {
    video: {
      name: 'Video',
      url: undefined
    },
    actions: {
      name: 'Actions Data',
      url: undefined
    },
    cognitiveLoad: {
      teamLead: {
        name: 'Team Lead',
        url: undefined
      },
      average: {
        name: 'Average',
        url: undefined
      },
      defib: {
        name: 'Defibrillator',
        url: undefined
      },
      compressor: {
        name: 'Compressor',
        url: undefined
      },
      airway: {
        name: 'Airway',
        url: undefined
      }
    },
    visualAttention: {
      teamLead: {
        name: 'Team Lead',
        url: undefined
      },
      defib: {
        name: 'Defibrillator',
        url: undefined
      },
      compressor: {
        name: 'Compressor',
        url: undefined
      },
      airway: {
        name: 'Airway',
        url: undefined
      }
    }
  },
  '01012025 (copy of 09182024)': {
    video: {
      name: 'Video',
      url: `${baseUrl}/gzpo2mer8tigrit3npjxv/timeline-multiplayer-09182024.mp4?rlkey=6sbj1ru1qze8mmf2xgww5q9tt&st=2gnlyx5i&dl=0`
    },
    actions: {
      name: 'Actions Data',
      url: `${baseUrl}/6os941r9qnk19nkd22415/timeline-multiplayer-09182024.csv?rlkey=4lpfpmkf62fnua597t7bh3p17&st=kgj7uu6l&dl=0`
    },
    cognitiveLoad: {
      teamLead: {
        name: 'Team Lead',
        url: `${baseUrl}/6lmdyuka085hdpakzp7kn/team_lead_cognitive_load.json?rlkey=fm7881olmj0uu7j3zf111ebpd&st=cxwrqgo2&dl=0`
      },
      average: {
        name: 'Average',
        url: `${baseUrl}/qnbk37u8b749v181c1kwt/average_cognitive_load.json?rlkey=cb82ggqrn6rqcvi1f055u92zq&st=9eto5ucj&dl=0`
      },
      defib: {
        name: 'Defibrillator',
        url: `${baseUrl}/nhbt6rd1mz6tpseuxtk1d/defib_cognitive_load.json?rlkey=urn8azmqecma6p2vq7n4mogfg&st=1r44lsx1&dl=0`
      },
      compressor: {
        name: 'Compressor',
        url: `${baseUrl}/dy8mxgddiy9zo7ilefhde/compressor_cognitive_load.json?rlkey=1zqdqaqkqchollucv258za1z6&st=2m59wrfl&dl=0`
      },
      airway: {
        name: 'Airway',
        url: `${baseUrl}/v39rhujeqde7pj3r57xlk/airway_cognitive_load.json?rlkey=79b0094va3d4n6teq6zn4ko11&st=3n5gf8ie&dl=0`
      }
    },
    visualAttention: {
      teamLead: {
        name: 'Team Lead',
        url: `${baseUrl}/ujv8zhqty08u2xmcb7mt9/team_lead_fixation_data.json?rlkey=ni6lwp5a6cx7ioe9ydr4uerxe&st=m90n3yjg&dl=0`
      },
      defib: {
        name: 'Defibrillator',
        url: `${baseUrl}/64rs4pjq7iyva4hceq553/defib_fixation_data.json?rlkey=3a22v8gqwym18iej2usarlmc2&st=t9kdd47x&dl=0`
      },
      compressor: {
        name: 'Compressor',
        url: `${baseUrl}/rnt4fk27e55xqmtgqdww5/cpr_fixation_data.json?rlkey=hdm0ara4on6it50dszif3ualx&st=khc7myuo&dl=0`
      },
      airway: {
        name: 'Airway',
        url: `${baseUrl}/natojy0easb7ckev55mgs/airway_fixation_data.json?rlkey=kqmpytb0i00xjrn8jy66arysq&st=u6amcn8x&dl=0`
      }
    }
  }
};

export default PlotsFileSource;
