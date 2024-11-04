'use client';
import {useEffect, useState} from 'react';
import {Layout, PlotData} from 'plotly.js';
import dynamic from 'next/dynamic';

const Plot = dynamic(() => import('react-plotly.js'), {ssr: false});

interface PlotCounts {
  time: number;
  counts: Record<string, number>;
}

interface GazeDataPoint {
  time: number; // Unix timestamp in seconds
  category: string; // "Team", "Patient", "Equipment", "Monitors", etc.
}

const windowSize = 10; // 10 seconds
const stepSize = 10; // 10 seconds
const categories = ['Team', 'Patient', 'Equipment', 'Monitors'];

// Function to calculate category counts in sliding windows
function calculateCategoryCounts(
  data: GazeDataPoint[],
  windowSize: number, // in seconds
  stepSize: number // in seconds
): {time: number; counts: PlotCounts['counts']}[] {
  const result: {time: number; counts: Record<string, number>}[] = [];

  // Find the minimum and maximum time in the data
  const minTime = Math.min(...data.map((d) => d.time));
  const maxTime = Math.max(...data.map((d) => d.time));

  // Iterate through each window start time
  for (let startTime = minTime; startTime <= maxTime; startTime += stepSize) {
    const endTime = startTime + windowSize;

    // Count occurrences of each category within the window
    const counts: Record<string, number> = {};
    data.forEach((d) => {
      if (d.time >= startTime && d.time < endTime) {
        counts[d.category] = (counts[d.category] || 0) + 1;
      }
    });

    // Add the result for this window
    result.push({time: startTime, counts});
  }

  return result;
}

// Function to transform data into Plotly format for a stacked bar chart
function transformDataForPlotly(categoryCounts: PlotCounts[], categories: string[]) {
  const x = categoryCounts.map((d) => new Date(d.time * 1000).toISOString()); // Convert to ISO string for better readability
  return categories.map((category) => ({
    x: x,
    y: categoryCounts.map((d) => d.counts[category] || 0),
    name: category,
    type: 'bar'
  }));
}

const Page = () => {
  const [plotData, setPlotData] = useState<Partial<PlotData>[]>([]);
  useEffect(() => {
    const fetchAndProcessData = async () => {
      const baseUrl = 'https://dl.dropboxusercontent.com/scl/fi';
      const response = await fetch(
        `${baseUrl}//ujv8zhqty08u2xmcb7mt9/team_lead_fixation_data.json?rlkey=ni6lwp5a6cx7ioe9ydr4uerxe&st=m90n3yjg&dl=0`
      );
      const data = await response.json();

      const categoryCounts = calculateCategoryCounts(data, windowSize, stepSize);

      const plotData = transformDataForPlotly(categoryCounts, categories);
      setPlotData(plotData as Partial<PlotData>[]);
    };

    fetchAndProcessData().catch(console.error);
  }, []);
  return (plotData??[]).length === 0 ? <div>Loading...</div> : (
    <>
      <Plot
        data={plotData}
        layout={
          {
            title: 'Category Distribution Over Time - non blending (sliding window: 10 s, step: 10 s)',
            barmode: 'stack',
            xaxis: {
              title: 'Time',
              // type: 'category', // Display timestamps as categories
              type: 'date', // Use 'date' type to allow formatting
              tickformat: '%I:%M:%S %p', // Display as hh:mm:ss AM/PM
              tickvals: plotData[0]?.x?.map((d) => d as number), // Set tick values to each time point
              ticktext: (plotData[0]?.x as string[]).map((d) =>
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
      <Plot
        data={plotData}
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
              tickvals: plotData[0]?.x?.map((d) => d as number), // Set tick values to each time point
              ticktext: (plotData[0]?.x as string[]).map((d) =>
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
          } as Partial<Plotly.Layout>
        }
        style={{width: '100%', height: '500px'}}
      />
    </>
  );
};

export default Page;
