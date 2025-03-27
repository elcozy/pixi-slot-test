interface GameButtonProps {
  title: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const GameButton = ({
  title,
  onClick,
  disabled,
  className,
  children,
}: GameButtonProps) => (
  <button
    type="button"
    title={title}
    className={`p-3 rounded-full transition shadow-lg flex items-center justify-center ${className} ${
      disabled ? "opacity-50 cursor-not-allowed" : "hover:opacity-80 cursor-pointer"
    }`}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);
