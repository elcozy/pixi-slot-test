import { FaVolumeUp, FaVolumeMute, FaSyncAlt, FaBolt, FaStop } from 'react-icons/fa';
import useGameControls from '@/game/app/hooks/useGameControls';
import { GameButton } from '@/game/app/components/GameButton';

export const GameControls = () => {
  const {
    gameSpeed,
    isMuted,
    isSpinning,
    isSpinBtnDisabled,
    isVisible,
    handleSpin,
    handleStop,
    handleIncreaseSpeed,
    handleSoundToggle,
  } = useGameControls();

  return (
    <section className={`max-w-[1026px] min-w-[300px] mx-auto flex justify-between items-center px-6 py-3 bg-gradient-to-r from-[#1E293B] to-[#0F172A] lg:rounded-b-xl transition-transform duration-900 ease-out
      ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
      <GameButton title="Sound" onClick={handleSoundToggle} className="bg-[#5B3B1C] text-white">
        {isMuted ? <FaVolumeMute size={22} /> : <FaVolumeUp size={22} />}
      </GameButton>

      <div className="flex items-center ml-3">
        <GameButton
          title="Increase Speed"
          onClick={handleIncreaseSpeed}
          className="relative bg-[#E63946] text-white flex items-center justify-center mr-3"
        >
          <FaBolt size={18} />
          {Boolean(gameSpeed) && (
            <span
              className={`absolute -bottom-1 -right-1 bg-white text-[#E63946] px-1 rounded-full text-xs font-bold`}
            >
              {gameSpeed ? `${gameSpeed}x` : ''}
            </span>)}
        </GameButton>

        <GameButton
          title="Stop"
          onClick={handleStop}
          disabled={!isSpinning}
          className={`bg-gray-600 text-white mr-3 ${!isSpinning ? "cursor-not-allowed" : "bg-red-500"}`}
        >
          <FaStop size={18} />
        </GameButton>

        <GameButton
          title="Spin"
          onClick={handleSpin}
          disabled={isSpinBtnDisabled}
          className={`
            bg-[#FFA500]
            disabled:bg-[#D9A760]
            disabled:hover:bg-[#D9A760]
            disabled:hover:opacity-none
            hover:opacity-none
            hover:bg-[#E69500]
            ${isSpinning ? "bg-[#E69500]" : ""}
            text-white p-6 disabled:cursor-not-allowed`}
        >
          <FaSyncAlt size={24} className={`transform ${isSpinning ? "animate-spin" : ""}`} />
        </GameButton>
      </div>
    </section>
  );
};
   