import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GameControls } from '@/game/app/components/GameControls';
import useGameControls from '@/game/app/hooks/useGameControls';

vi.mock('@/game/app/hooks/useGameControls');

describe('GameControls', () => {
  let handleSpin: any;
  let handleStop: any;
  let handleIncreaseSpeed: any;
  let handleSoundToggle: any;

  beforeEach(() => {
    handleSpin = vi.fn();
    handleStop = vi.fn();
    handleIncreaseSpeed = vi.fn();
    handleSoundToggle = vi.fn();

    vi.mocked(useGameControls).mockReturnValue({
      gameSpeed: 1,
      isMuted: false,
      isSpinning: false,
      isSpinBtnDisabled: false,
      isVisible: true,
      handleSpin,
      handleStop,
      handleIncreaseSpeed,
      handleSoundToggle,
    });
  });

  it('renders all buttons correctly', () => {
    render(<GameControls />);

    expect(screen.getByTitle('Sound')).toBeInTheDocument();
    expect(screen.getByTitle('Increase Speed')).toBeInTheDocument();
    expect(screen.getByTitle('Stop')).toBeInTheDocument();
    expect(screen.getByTitle('Spin')).toBeInTheDocument();
  });

  it('calls the correct handlers when buttons are clicked', () => {
    render(<GameControls />);

    const soundButton = screen.getByTitle('Sound');
    fireEvent.click(soundButton);
    expect(handleSoundToggle).toHaveBeenCalled();

    const increaseSpeedButton = screen.getByTitle('Increase Speed');
    fireEvent.click(increaseSpeedButton);
    expect(handleIncreaseSpeed).toHaveBeenCalled();

    const spinButton = screen.getByTitle('Spin');
    fireEvent.click(spinButton);
    expect(handleSpin).toHaveBeenCalled();
  });

  it('disables the stop button when not spinning', () => {
    render(<GameControls />);

    const stopButton = screen.getByTitle('Stop');
    expect(stopButton).toBeDisabled();
  });

  it('disables the spin button when already spinning', () => {
    vi.mocked(useGameControls).mockReturnValue({
      gameSpeed: 1,
      isMuted: false,
      isSpinning: true,
      isSpinBtnDisabled: true,
      isVisible: true,
      handleSpin: vi.fn(),
      handleStop: vi.fn(),
      handleIncreaseSpeed: vi.fn(),
      handleSoundToggle: vi.fn(),
    });

    render(<GameControls />);

    const spinButton = screen.getByTitle('Spin');
    expect(spinButton).toBeDisabled();
  });
});
