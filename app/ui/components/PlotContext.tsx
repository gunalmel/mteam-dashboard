import {createContext} from 'react';
import {useActionsData} from '@/app/hooks/useActionsData';
import {DataSources} from '@/types';

type ActionsData = ReturnType<typeof useActionsData>;
const PlotContext = createContext<{
  dataSources: DataSources;
  actionsData: ActionsData;
}>({} as {
  dataSources: DataSources;
  actionsData: ActionsData;
});

export default PlotContext;
