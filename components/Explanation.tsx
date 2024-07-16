import React from 'react';

const Explanation = () => (
    <div className={'pl-28'}>
        <div className="mb-2">
            <hr className="border-t-2 border-green-600 w-6 inline-block my-1" />
            : Compression Interval
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

export default Explanation;
