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
        data={plotData.plotlyData}
        layout={
          {
            title: 'Category Distribution Over Time - blending (sliding window: 10 s, step: 10 s)',
            barmode: 'stack',
            bargap: 0, // Remove gaps between bars
            xaxis: {
              title: 'Time',
              // type: 'category', // Display timestamps as categories
              type: 'date', // Use 'date' type to allow formatting
              tickformat: '%I:%M:%S %p', // Display as hh:mm:ss AM/PM
              tickvals: plotData.tickVals.map((d) => d), // Set tick values to each time point
              ticktext: (plotData.tickVals as string[]).map((d) =>
                new Date(d).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: true
                })
              ),
              tickmode: 'array', // Use tickvals and ticktext for custom labeling
              dtick: 10000, // 10-second intervals for labeling every bar
              automargin: true
            },
            yaxis: {
              title: 'Count of Category'
            }
          } as Partial<Layout>
        }
        style={{width: '100%', height: '500px'}}
      />
  );
};

export default Page;
