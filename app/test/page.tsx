'use client';
import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import Papa from 'papaparse';

function timeToSeconds(timeStr: string) {
    const parts = timeStr.split(':');
    return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
}

const icons = {
    "Pulse Check": "💓",
    "Select Epinephrine": "💉",
    "Select Amiodarone": "💉",
    "Shock": "⚡",
    "Order Cooling": "🌡️",
    "Order EKG": "📈",
    "Intubation": "💨",
    "Order X-Ray": "☢️",
    "Labs": "🧪",
    "Lung Sounds": "🩺"
};

const Explanation = () => (
    <div className={'pl-28'}>
        <div className="mb-2">
            <hr className="border-t-2 border-green-600 w-6 inline-block my-1" /> : Compression Interval
        </div>
        <div className="grid grid-cols-3 gap-2">
            <div className="flex items-center">
                <span className="mr-1">💓</span> Pulse Check
            </div>
            <div className="flex items-center">
                <span className="mr-1">🩺</span> Lung Sounds
            </div>
            <div className="flex items-center">
                <span className="mr-1">☢️</span> X-Ray
            </div>
            <div className="flex items-center">
                <span className="mr-1">💉</span> Epinephrine or Amiodarone
            </div>
            <div className="flex items-center">
                <span className="mr-1">📈</span> EKG
            </div>
            <div className="flex items-center">
                <span className="mr-1">🌡️</span> Cool
            </div>
            <div className="flex items-center">
                <span className="mr-1">⚡</span> Shock
            </div>
            <div className="flex items-center">
                <span className="mr-1">💨</span> Intubate
            </div>
            <div className="flex items-center">
                <span className="mr-1">🧪</span> New Labs
            </div>
        </div>
    </div>
);

const Page = () => {
    const [data, setData] = useState([]);
    const [layout, setLayout] = useState({});

    useEffect(() => {
        const subActionExclusions = ['Begin CPR', 'Enter CPR', 'Stop CPR'];

        const timestamps: string[] = [];
        const actions = [];
        const subActions: string[] = [];
        let beginCPR: string;
        let stopCPR;
        const annotations: string[] = [];
        const traceCPR: { x: number[]; y: number[]; mode: string; type: string; text: string; hovertext: string[]; hoverinfo: string; textposition: string; marker: { size: number; }; line: { color: string; }; }[] = [];

        Papa.parse('https://raw.githubusercontent.com/thedevagyasharma/mteam-dashboard/main/src/Data_sample2/timeline-multiplayer%20(32).csv', {
            download: true,
            header: true,

            step: function(row) {
                // @ts-ignore
                const timestamp = row.data['Time Stamp[Hr:Min:Sec]'];
                // @ts-ignore
                const action = row.data['Action/Vital Name'];
                // @ts-ignore
                const subAction = row.data['SubAction Name'];
                if (subAction === "Begin CPR" || subAction === "Enter CPR") {
                    beginCPR = timestamp;
                }
                if (subAction === "Stop CPR") {
                    stopCPR = timestamp;
                    traceCPR.push({
                        x: [timeToSeconds(beginCPR), timeToSeconds(stopCPR)],
                        y: [0.98, 0.98],
                        mode: 'lines',
                        type: 'scatter',
                        text: '',
                        hovertext: [`${beginCPR}`, `${stopCPR}`],
                        hoverinfo: 'text',
                        textposition: 'top center',
                        marker: { size: 12 },
                        line: {
                            color: 'rgb(0, 150, 0)'
                        }
                    });
                }
                if (action && (!subAction || subActionExclusions.includes(subAction) || !action.includes('(action)') || action.includes('User Introduction'))) {
                    return;
                }

                if (action) {
                    const annotation = `${timestamp}, ${subAction}`;
                    timestamps.push(timestamp);
                    actions.push(action);
                    subActions.push(subAction);
                    annotations.push(annotation);
                }
            },
            complete: function() {
                // @ts-ignore
                const iconText = subActions.map(subAction => icons[Object.keys(icons).find(k => subAction.includes(k))] || "");

                const timeInSeconds = timestamps.map(timeToSeconds);

                const traceActions = {
                    x: timeInSeconds,
                    y: new Array(timeInSeconds.length).fill(1),
                    mode: 'text',
                    type: 'scatter',
                    text: iconText,
                    hovertext: annotations,
                    hoverinfo: 'text',
                    textposition: 'top center',
                    marker: { size: 12 }
                };

                const layoutConfig = {
                    title: 'Clinical Review Timeline',
                    xaxis: { title: 'Time (seconds)', showgrid: false },
                    yaxis: { visible: false, range: [0, 2] },
                    showlegend: false,
                    shapes: [
                        {
                            type: 'rect',
                            xref: 'paper',
                            yref: 'paper',
                            x0: 0,
                            x1: 1 / 6,
                            y0: 0,
                            y1: 1,
                            fillcolor: '#EECDCA',
                            layer: 'below',
                            line: { width: 0 }
                        },
                        {
                            type: 'rect',
                            xref: 'paper',
                            yref: 'paper',
                            x0: 1 / 6,
                            x1: 2 / 6,
                            y0: 0,
                            y1: 1,
                            fillcolor: '#FCF6F2',
                            layer: 'below',
                            line: { width: 0 }
                        },
                        {
                            type: 'rect',
                            xref: 'paper',
                            yref: 'paper',
                            x0: 2 / 6,
                            x1: 3 / 6,
                            y0: 0,
                            y1: 1,
                            fillcolor: '#FEF9ED',
                            layer: 'below',
                            line: { width: 0 }
                        },
                        {
                            type: 'rect',
                            xref: 'paper',
                            yref: 'paper',
                            x0: 3 / 6,
                            x1: 4 / 6,
                            y0: 0,
                            y1: 1,
                            fillcolor: '#F3F7EE',
                            layer: 'below',
                            line: { width: 0 }
                        },
                        {
                            type: 'rect',
                            xref: 'paper',
                            yref: 'paper',
                            x0: 4 / 6,
                            x1: 5 / 6,
                            y0: 0,
                            y1: 1,
                            fillcolor: '#F1F5FA',
                            layer: 'below',
                            line: { width: 0 }
                        },
                        {
                            type: 'rect',
                            xref: 'paper',
                            yref: 'paper',
                            x0: 5 / 6,
                            x1: 1,
                            y0: 0,
                            y1: 1,
                            fillcolor: '#F0EBF5',
                            layer: 'below',
                            line: { width: 0 }
                        }
                    ],
                    annotations: [
                        {
                            xref: 'paper',
                            yref: 'paper',
                            x: 1 / 12,
                            y: 0.95,
                            xanchor: 'center',
                            yanchor: 'middle',
                            text: 'Stage 1 - PEA',
                            showarrow: false,
                            textangle: 0
                        },
                        {
                            xref: 'paper',
                            yref: 'paper',
                            x: 3 / 12,
                            y: 0.95,
                            xanchor: 'center',
                            yanchor: 'middle',
                            text: 'Stage 2 - V. Fib.',
                            showarrow: false,
                            textangle: 0
                        },
                        {
                            xref: 'paper',
                            yref: 'paper',
                            x: 5 / 12,
                            y: 0.95,
                            xanchor: 'center',
                            yanchor: 'middle',
                            text: 'Stage 3 - PEA',
                            showarrow: false,
                            textangle: 0
                        },
                        {
                            xref: 'paper',
                            yref: 'paper',
                            x: 7 / 12,
                            y: 0.95,
                            xanchor: 'center',
                            yanchor: 'middle',
                            text: 'Stage 4 - ROSC',
                            showarrow: false,
                            textangle: 0
                        },
                        {
                            xref: 'paper',
                            yref: 'paper',
                            x: 9 / 12,
                            y: 0.95,
                            xanchor: 'center',
                            yanchor: 'middle',
                            text: 'Stage 5 - PEA',
                            showarrow: false,
                            textangle: 0
                        },
                        {
                            xref: 'paper',
                            yref: 'paper',
                            x: 11 / 12,
                            y: 0.95,
                            xanchor: 'center',
                            yanchor: 'middle',
                            text: 'Stage 6 - ROSC',
                            showarrow: false,
                            textangle: 0
                        }
                    ]
                };

                // @ts-ignore
                setData([traceActions, ...traceCPR]);
                setLayout(layoutConfig);
            }
        });

    }, []);

    return (
        // <div className="min-h-screen flex items-center justify-center p-4">
        //     <div className="flex flex-col items-center">
        //         <div className="bg-gray-200 p-4 mb-4">Hello</div>
        //         <div className="bg-white p-4" style={{ width: '100%', height: '600px' }}>
        //             <Plot
        //                 data={data}
        //                 layout={layout}
        //                 style={{ width: '100%', height: '100%' }}
        //                 useResizeHandler={true}
        //             />
        //         </div>
        //     </div>
        // </div>
        //
        <div className="flex flex-col justify-evenly">
            <Explanation/>
            <div className="bg-white p-4" style={{width: '100%', height: '600px'}}>
                <Plot
                    data={data}
                    layout={layout}
                    style={{width: '100%', height: '100%'}}
                    useResizeHandler={true} // Ensure the plot adjusts size when container changes
                />
            </div>
        </div>
        // <div className={'grid grid-flow-row auto-rows-max grid-cols-1'}>
        //     <div>
        //         <Plot
        //             data={data}
        //             layout={layout}
        //             style={{width: '100%', height: '600px'}}
        //         />
        //     </div>
        //     <div>
        //         <Explanation/>
        //     </div>
        // </div>
    )
        ;
};

export default Page;

