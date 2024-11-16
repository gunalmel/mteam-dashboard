// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import xhr2 from 'xhr2'; //needed by PapaParse remote file loading
import PlotsFileSource from '@/app/utils/plotSourceProvider';
import {parseCsvDataAsync} from '@/app/lib/csv/actionCsvParser';
import FilteredActionsPlot from '@/app/server-side-prototype/components/FilteredActionsPlotNew';

global.XMLHttpRequest = xhr2.XMLHttpRequest;

const Page = async () => {
  const data  =  await parseCsvDataAsync(PlotsFileSource.actions['09182024'].url);
  const actionGroupIcons = Object.entries(data.actionGroupIconMap).map((entry) => ({value: entry[0], source: entry[1]}));

 return (
   <FilteredActionsPlot actionGroupIcons={actionGroupIcons} actionsData={data.plotData} actionsLayout={data.layoutConfig} currentTime={0} />
 );
};

export default Page;
