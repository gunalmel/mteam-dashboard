import {DataSourceSelectorProps} from '@/types';
import {FC} from 'react';

const DataSourceSelector: FC<DataSourceSelectorProps> = ({
  dataSources,
  selectedDataSource,
  onDataSourceChange,
}) => {
  return (
    <div className="flex items-center justify-center gap-4 p-4 text-sm">
      <label htmlFor="simulation-date" className="text-gray-700 font-medium">
        Select simulation data:
      </label>
      <select
        id="simulation-date"
        value={selectedDataSource}
        onChange={(e) => onDataSourceChange(e.target.value)}
        className="border rounded-md cursor-pointer text-xs"
      >
        {Object.keys(dataSources).map((date) => (
          <option key={date} value={date}>
            {date}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DataSourceSelector;
