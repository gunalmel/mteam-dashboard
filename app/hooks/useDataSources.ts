import PlotsFileSource, {fetchSourceFilesIndex} from '@/app/utils/plotSourceProvider';
import {useEffect, useState} from 'react';

export function useDataSources() {
  const [dataSources, setDataSources] = useState<typeof PlotsFileSource>({});

  useEffect(() => {
    const fetchData = async () => {
        const result = await fetchSourceFilesIndex();
        setDataSources(result);
    };

    fetchData().catch(error => console.error('Error fetching data sources: ', error));
  }, []);
  return [dataSources];
}
