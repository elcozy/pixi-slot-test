import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { GameButton } from './GameButton';

describe('GameButton', () => {
  it('renders with given title', () => {
    render(<GameButton title='Test Button' onClick={() => {}}>Click Me</GameButton>);
    expect(screen.getByTitle('Test Button')).toBeInTheDocument();
  });

  it('triggers onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<GameButton title='Click Test' onClick={handleClick}>Click</GameButton>);

    fireEvent.click(screen.getByTitle('Click Test'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('disables the button when disabled prop is true', () => {
    const handleClick = vi.fn();
    render(
      <GameButton title='Disabled Button' onClick={handleClick} disabled>
        Disabled
      </GameButton>
    );

    const button = screen.getByTitle('Disabled Button');
    fireEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
    expect(button).toBeDisabled();
  });
});
