import { useState, useEffect, useRef } from 'react';
import { CustomEvents } from '@/game/utils/CustomEvents';
import { EControlsEv } from '@/events';
import { randRes } from '@/mocked/mockRes';
import { userSettings } from '@/game/engine/utils/userSettings';
import clickSound from '/assets/sounds/click.mp3?url';

const useGameControls = () => {
  const [gameSpeed, setGameSpeed] = useState(userSettings.getGameSpeed());
  const [isMuted, setIsMuted] = useState(userSettings.isMuted());
  const [isSpinning, setIsSpinning] = useState(false);
  const [isSpinBtnDisabled, setIsSpinBtnDisabled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const clickAudioRef = useRef(new Audio(clickSound));

  useEffect(() => {
    CustomEvents.add(EControlsEv.On_MainScreenLoaded, () => setIsVisible(true));
    CustomEvents.add(EControlsEv.Emit_SpinAnimStart, () => {
      setIsSpinning(true);
      setIsSpinBtnDisabled(true);
    });
    CustomEvents.add(EControlsEv.Emit_SpinAnimDone, () => setIsSpinning(false));
    CustomEvents.add(EControlsEv.Emit_WinCountUpDone, () => setIsSpinBtnDisabled(false));
  }, []);

  const playClickSound = () => {
    if (!isMuted) {
      clickAudioRef.current.currentTime = 0;
      clickAudioRef.current.play();
    }
  };

  const handleSpin = () => {
    playClickSound();

    if (!isSpinning) {
      CustomEvents.dispatch(EControlsEv.On_SpinBtn);

      setTimeout(() => {
        CustomEvents.dispatch(EControlsEv.On_SpinEnd, randRes);
      }, Math.random() * 2000);

      return;
    }

    setIsSpinning(false);
    CustomEvents.dispatch(EControlsEv.On_StopSpin);
  };

  const handleStop = () => {
    playClickSound();
    setIsSpinning(false);
    CustomEvents.dispatch(EControlsEv.On_StopSpin);
  };

  const handleIncreaseSpeed = () => {
    playClickSound();
    const newSpeed = ((Number(gameSpeed) + 1) % 3) as 0 | 1 | 2;

    if (newSpeed !== gameSpeed) {
      userSettings.setGameSpeed(newSpeed);
      setGameSpeed(newSpeed);
    }
  };

  const handleSoundToggle = () => {
    playClickSound();
    userSettings.setMasterVolume(isMuted ? 1 : 0);
    setIsMuted(!isMuted);
  };

  return {
    gameSpeed,
    isMuted,
    isSpinning,
    isSpinBtnDisabled,
    isVisible,
    handleSpin,
    handleStop,
    handleIncreaseSpeed,
    handleSoundToggle,
  };
};

export default useGameControls;
