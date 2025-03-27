import { act, renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import useGameControls from './useGameControls';
import { CustomEvents } from '@/game/utils/CustomEvents';
import { EControlsEv } from '@/events';

describe('useGameControls', () => {
  it('initializes with default state', () => {
    const { result } = renderHook(() => useGameControls());

    expect(result.current.gameSpeed).toBe(0);
    expect(result.current.isMuted).toBe(false);
    expect(result.current.isSpinning).toBe(false);
    expect(result.current.isSpinBtnDisabled).toBe(false);
    expect(result.current.isVisible).toBe(false);
  });

  it('handles sound toggle', () => {
    const { result } = renderHook(() => useGameControls());

    act(() => {
      result.current.handleSoundToggle();
    });

    expect(result.current.isMuted).toBe(true);
  });

  it('handles spin event', () => {
    const { result } = renderHook(() => useGameControls());

    act(() => {
      CustomEvents.dispatch(EControlsEv.Emit_SpinAnimStart);
    });

    expect(result.current.isSpinning).toBe(true);
    expect(result.current.isSpinBtnDisabled).toBe(true);
  });

  it('handles stop event', () => {
    const { result } = renderHook(() => useGameControls());

    act(() => {
      result.current.handleStop();
    });

    expect(result.current.isSpinning).toBe(false);
    expect(result.current.isSpinBtnDisabled).toBe(false);
  });

  it('handles speed increase cycling between 0 > 1 > 2 > 0', () => {
    const { result } = renderHook(() => useGameControls());

    act(() => result.current.handleIncreaseSpeed());
    expect(result.current.gameSpeed).toBe(1);

    act(() => result.current.handleIncreaseSpeed());
    expect(result.current.gameSpeed).toBe(2);

    act(() => result.current.handleIncreaseSpeed());
    expect(result.current.gameSpeed).toBe(0);
  });

  it('handles visibility change when game screen loads', () => {
    const { result } = renderHook(() => useGameControls());

    act(() => {
      CustomEvents.dispatch(EControlsEv.On_MainScreenLoaded);
    });

    expect(result.current.isVisible).toBe(true);
  });
});
