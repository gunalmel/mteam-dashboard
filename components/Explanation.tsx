import React from 'react';
import { explanationItems } from '@/components/constants';

interface ExplanationItemProps {
    icon: string;
    text: string;
    isChecked: boolean;
    onToggle: () => void;
}

const ExplanationItem: React.FC<ExplanationItemProps> = ({ icon, text, isChecked, onToggle }) => (
    <div className="flex items-center">
        <input type="checkbox" checked={isChecked} onChange={onToggle} className="mr-2" />
        <span className="mr-1">{icon}</span> {text}
    </div>
);

interface ExplanationProps {
    selectedMarkers: string[];
    onSelectAll: (selectAll: boolean) => void;
    onToggleMarker: (markers: string[]) => void;
}

const Explanation: React.FC<ExplanationProps> = ({ selectedMarkers, onSelectAll, onToggleMarker }) => {
    const allSelected = explanationItems.every(item => item.relatedMarkers.every(marker => selectedMarkers.includes(marker)));
    return (
        <div className="pl-28">
            <div className="mb-2">
                <hr className="border-t-2 border-green-600 w-6 inline-block my-1" /> : Compression Interval
            </div>
            <div className="flex items-center mb-4">
                <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) => onSelectAll(e.target.checked)}
                    className="mr-2"
                />
                <span>Select All</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
                {explanationItems.map((item, index) => (
                    <ExplanationItem
                        key={index}
                        icon={item.icon}
                        text={item.text}
                        isChecked={item.relatedMarkers.every(marker => selectedMarkers.includes(marker))}
                        onToggle={() => onToggleMarker(item.relatedMarkers)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Explanation;
