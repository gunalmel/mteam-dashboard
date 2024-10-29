import {createContext} from 'react';
import {useActionsData} from '@/app/hooks/useActionsData';

const PlotContext = createContext<ReturnType<typeof useActionsData>>({} as ReturnType<typeof useActionsData>);

export default PlotContext;
