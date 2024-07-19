import React from 'react';

const explanationItems = [
    { icon: '💓', text: 'Pulse Check' },
    { icon: '🩺', text: 'Lung Sounds' },
    { icon: '☢️', text: 'X-Ray' },
    { icon: '💉', text: 'Medication' },
    { icon: '📈', text: 'EKG' },
    { icon: '🌡️', text: 'Cool' },
    { icon: '⚡', text: 'Shock' },
    { icon: '💨', text: 'Intubate' },
    { icon: '🧪', text: 'Labs' },
];

interface ExplanationItemProps {
    icon: string;
    text: string;
}

const ExplanationItem: React.FC<ExplanationItemProps> = ({ icon, text }) => (
    <div className="flex items-center">
        <span className="mr-1">{icon}</span> {text}
    </div>
);

const Explanation: React.FC = () => (
    <div className="pl-28">
        <div className="mb-2">
            <hr className="border-t-2 border-green-600 w-6 inline-block my-1" /> : Compression Interval
        </div>
        <div className="grid grid-cols-3 gap-2">
            {explanationItems.map((item, index) => (
                <ExplanationItem key={index} icon={item.icon} text={item.text} />
            ))}
        </div>
    </div>
);

export default Explanation;
