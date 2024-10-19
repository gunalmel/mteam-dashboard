import { render, fireEvent } from '@testing-library/react';
import ImageToggle from '@/app/ui/components/ImageToggle';

describe('ImageToggle', () => {
  const mockOnToggle = jest.fn();
  const props = {
    source: '/icons/intubation.png',
    value: 'Order Intubation',
    checked: false,
    onToggle: mockOnToggle,
  };

  it('renders correctly', () => {
    const { getByText, getByAltText } = render(<ImageToggle {...props} />);
    expect(getByText('Order Intubation')).toBeInTheDocument();
    expect(getByAltText('On/Off')).toBeInTheDocument();
  });

  it('calls onToggle with the value selected', () => {
    const { getByRole } = render(<ImageToggle {...props} />);
    const checkbox = getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(mockOnToggle).toHaveBeenCalledWith('Order Intubation', true);
  });

  it('displays the correct image based on checked state', () => {
    const { rerender, getByAltText } = render(<ImageToggle {...props} />);
    const image = getByAltText('On/Off');
    expect(image).toHaveClass('grayscale');

    rerender(<ImageToggle {...props} checked={true} />);
    expect(image).not.toHaveClass('grayscale');
  });
});
