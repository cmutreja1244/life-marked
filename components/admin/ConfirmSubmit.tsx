"use client";

type ConfirmSubmitProps = {
  message: string;
  children: string;
  className?: string;
};

export function ConfirmSubmit({ message, children, className = "btn-primary" }: ConfirmSubmitProps) {
  return (
    <button
      className={className}
      type="submit"
      onClick={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
