import { render, screen, fireEvent } from '@testing-library/react';
import ToggleGrid from '@/app/ui/components/ToggleGrid';
import { ToggleGridProps } from '@/types';

const items = [
  { value: 'item1', source: '/source1' },
  { value: 'item2', source: '/source2' },
  { value: 'item3', source: '/source3' },
];

const renderComponent = (props: Partial<ToggleGridProps> = {}) => {
  const defaultProps: ToggleGridProps = {
    items,
    onChange: jest.fn(),
    ...props,
  };
  return render(<ToggleGrid {...defaultProps} />);
};

describe('ToggleGrid', () => {
  test('all items should be checked at the first render', () => {
    renderComponent();

    const toggleAllCheckbox = screen.getByTestId('toggle-all');
    expect(toggleAllCheckbox).toBeChecked();
    items.forEach((item) => {

      const checkbox = screen.getByText(item.value);
      expect(checkbox).toBeInTheDocument();
      expect(screen.getByDisplayValue(item.value)).toBeChecked();
    });
  });

  test('toggles individual items', () => {
    const onChange = jest.fn();
    renderComponent({ onChange });

    const item1Checkbox = screen.getByLabelText('item1');
    fireEvent.click(item1Checkbox);
    expect(onChange).toHaveBeenCalledWith(['item2', 'item3']);
    const toggleAllCheckbox = screen.getByTestId('toggle-all');
    expect(toggleAllCheckbox).not.toBeChecked();

    fireEvent.click(item1Checkbox);
    expect(onChange).toHaveBeenCalledWith([]);
    expect(toggleAllCheckbox).toBeChecked();
  });

  test('toggles all items', () => {
    const onChange = jest.fn();
    renderComponent({ onChange });

    const toggleAllCheckbox = screen.getByTestId('toggle-all');
    expect(toggleAllCheckbox).toBeChecked();

    fireEvent.click(toggleAllCheckbox);
    expect(onChange).toHaveBeenNthCalledWith(1,[]);

    fireEvent.click(toggleAllCheckbox);
    expect(onChange).toHaveBeenNthCalledWith(2, items.map((item) => item.value));
  });
});
