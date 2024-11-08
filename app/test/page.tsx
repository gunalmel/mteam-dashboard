'use client';
import {Layout} from 'plotly.js';
import dynamic from 'next/dynamic';
import {useGazeData} from '@/app/hooks/useGazeData';

const Plot = dynamic(() => import('react-plotly.js'), {ssr: false});

const windowSize = 10; // 10-second window

const Page = () => {
  const [plotData] = useGazeData(windowSize);

  return Object.keys(plotData).length === 0 ? <div>Loading...</div> : (
      <Plot
        style={{width: '100%', height: '500px'}}
        data={plotData.plotlyData}
        layout={
          {
            title: 'Category Distribution Over Time - (sliding window: 10 s, step: 10 s)',
            automargin: true,
            barmode: 'stack',
            bargap: 0, // Remove gaps between bars
            xaxis: {
              title: 'Time',
              // type: 'date', // Use 'date' type to allow formatting
              tickmode: 'array', // Use tickvals and ticktext for custom labeling
              dtick: 100000000, // 10-second intervals for labeling every bar
              tickformat: '%H:%M:%S', // Display as hh:mm:ss AM/PM
              // tickvals: plotData.tickVals, // Set tick values to each time point, if you use this then the ticks are displayed every X mins
              // ticktext: (plotData.tickVals as string[]).map((d) =>
              //   new Date(d).toLocaleTimeString('en-US', {
              //     hour: '2-digit',
              //     minute: '2-digit',
              //     second: '2-digit',
              //     hour12: true
              //   })
              // )
            },
            yaxis: {
              title: 'Count of Category'
            }
          } as Partial<Layout>
        }
      />
  );
};

export default Page;
