import {fetchDataSources} from '@/app/utils/plotSourceProvider';
import {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {DataSources} from '@/types';

interface DataSourcesState {
  dataSources:  [DataSources, Dispatch<SetStateAction<DataSources>>],
  defaultDataSource: [string, Dispatch<SetStateAction<string>>]
}

export function useDataSources() {
  // const [dataSources, setDataSources] = useState<DataSources>({});
  const states: DataSourcesState = {
    dataSources: useState<DataSources>({}),
    defaultDataSource: useState<keyof DataSources>('')
  };

  const stateManager = Object.fromEntries(
    Object.entries(states)
      .map(([k, [value, set]]) => [k, { value, set }])
  ) ;

  useEffect(() => {
    const fetchData = async () => {
        const result = await fetchDataSources();
        stateManager.dataSources.set(result);
        stateManager.defaultDataSource.set(Object.keys(result)[0]);
    };

    fetchData().catch(error => console.error('Error fetching data sources: ', error));
  }, []);

  return stateManager;
}
