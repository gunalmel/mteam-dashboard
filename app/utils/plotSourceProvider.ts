const baseUrl = 'https://dl.dropboxusercontent.com/scl/fi';
const PlotsFileSource = {
  actions: {
    '06102024': {
      name: '06102024',
      url: `${baseUrl}/vj6wm2c30u3qqk5kbuj9v/timeline-multiplayer-06102024.csv?rlkey=ztegai6tskj3jgbxjbwz5l393&st=ofuo2z4c&dl=0`
    },
    '08052024': {
      name: '08052024',
      url: `${baseUrl}/tjl0wfx0nebdkx0w7al6w/timeline-multiplayer-08052024.csv?rlkey=kh4h2s09ombtkbu1iqpp6b7pg&st=b9hozrus&dl=0`
    },
    '09182024': {
      name: '09182024',
      url: `${baseUrl}/6os941r9qnk19nkd22415/timeline-multiplayer-09182024.csv?rlkey=4lpfpmkf62fnua597t7bh3p17&st=1v2zw6n3&dl=0`
    },
    '09302024': {
      name: '09302024',
      url: `${baseUrl}/1ls2txjhf6y1yqeab37i9/timeline-multiplayer-09302024.csv?rlkey=3opuazpyvp606md15pnjaxm3q&st=dvi2kwwd&dl=0`
    }
  },
  cognitiveLoad: {
    teamLead: {
      name: 'Team Lead',
      url: {
        '09302024': `${baseUrl}/6lmdyuka085hdpakzp7kn/team_lead_cognitive_load.json?rlkey=fm7881olmj0uu7j3zf111ebpd&st=cxwrqgo2&dl=0`
      }
    },
    average: {
      name: 'Average',
      url: {
        '09302024': `${baseUrl}/qnbk37u8b749v181c1kwt/average_cognitive_load.json?rlkey=cb82ggqrn6rqcvi1f055u92zq&st=9eto5ucj&dl=0`
      }
    },
    defib: {
      name: 'Defibrillator',
      url: {
        '09302024': `${baseUrl}/nhbt6rd1mz6tpseuxtk1d/defib_cognitive_load.json?rlkey=urn8azmqecma6p2vq7n4mogfg&st=1r44lsx1&dl=0`
      }
    },
    compressor: {
      name: 'Compressor',
      url: {
        '09302024': `${baseUrl}/dy8mxgddiy9zo7ilefhde/compressor_cognitive_load.json?rlkey=1zqdqaqkqchollucv258za1z6&st=2m59wrfl&dl=0`
      }
    },
    airway: {
      name: 'Airway',
      url: {
        '09302024': `${baseUrl}/v39rhujeqde7pj3r57xlk/airway_cognitive_load.json?rlkey=79b0094va3d4n6teq6zn4ko11&st=3n5gf8ie&dl=0`
      }
    }
  },
  visualAttention: {
    teamLead: {
      name: 'Team Lead',
      url: {
        '09302024': `${baseUrl}/ujv8zhqty08u2xmcb7mt9/team_lead_fixation_data.json?rlkey=ni6lwp5a6cx7ioe9ydr4uerxe&st=m90n3yjg&dl=0`
      }
    },
    defib: {
      name: 'Defibrillator',
      url: {
        '09302024': `${baseUrl}/64rs4pjq7iyva4hceq553/defib_fixation_data.json?rlkey=3a22v8gqwym18iej2usarlmc2&st=t9kdd47x&dl=0`
      }
    },
    compressor: {
      name: 'Compressor',
      url: {
        '09302024': `${baseUrl}/rnt4fk27e55xqmtgqdww5/cpr_fixation_data.json?rlkey=hdm0ara4on6it50dszif3ualx&st=khc7myuo&dl=0`
      }
    },
    airway: {
      name: 'Airway',
      url: {
        '09302024': `${baseUrl}/natojy0easb7ckev55mgs/airway_fixation_data.json?rlkey=kqmpytb0i00xjrn8jy66arysq&st=u6amcn8x&dl=0`
      }
    }
  }
};

export default PlotsFileSource;
