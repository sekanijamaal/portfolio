interface IconProps {
  className?: string;
  strokeWidth?: number;
}

const base = (className?: string) => className ?? 'h-4 w-4';

export function ArrowUpRight({ className, strokeWidth = 1.4 }: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={base(className)}
      aria-hidden="true"
    >
      <path d="M4 12 12 4M5 4h7v7" />
    </svg>
  );
}

export function ArrowRight({ className, strokeWidth = 1.4 }: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={base(className)}
      aria-hidden="true"
    >
      <path d="M2.5 8h11M9.5 4l4 4-4 4" />
    </svg>
  );
}

export function ArrowUp({ className, strokeWidth = 1.4 }: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={base(className)}
      aria-hidden="true"
    >
      <path d="M8 13.5v-11M4 6.5l4-4 4 4" />
    </svg>
  );
}

export function ArrowLeft({ className, strokeWidth = 1.4 }: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={base(className)}
      aria-hidden="true"
    >
      <path d="M13.5 8h-11M6.5 4l-4 4 4 4" />
    </svg>
  );
}

export function Close({ className, strokeWidth = 1.3 }: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      className={base(className)}
      aria-hidden="true"
    >
      <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" />
    </svg>
  );
}

export function Menu({ className, strokeWidth = 1.3 }: IconProps) {
  return (
    <svg
      viewBox="0 0 18 14"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      className={base(className)}
      aria-hidden="true"
    >
      <path d="M1 2h16M1 7h16M1 12h10" />
    </svg>
  );
}

export function Plus({ className, strokeWidth = 1.3 }: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      className={base(className)}
      aria-hidden="true"
    >
      <path d="M8 2.5v11M2.5 8h11" />
    </svg>
  );
}

export function Check({ className, strokeWidth = 1.4 }: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={base(className)}
      aria-hidden="true"
    >
      <path d="M2.5 8.5l3.5 3.5 7.5-8" />
    </svg>
  );
}

export function Mail({ className, strokeWidth = 1.3 }: IconProps) {
  return (
    <svg
      viewBox="0 0 18 14"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={base(className)}
      aria-hidden="true"
    >
      <rect x="1" y="1" width="16" height="12" />
      <path d="M1.5 1.5 9 8l7.5-6.5" />
    </svg>
  );
}

export function Github({ className, strokeWidth = 1.3 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={base(className)}
      aria-hidden="true"
    >
      <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
    </svg>
  );
}

export function Linkedin({ className, strokeWidth = 1.3 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={base(className)}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="1.5" />
      <path d="M7.5 10.5V17M7.5 7.2v.2M11.5 17v-3.6a2.4 2.4 0 0 1 4.8 0V17M11.5 10.5V17" />
    </svg>
  );
}

export function Printer({ className, strokeWidth = 1.3 }: IconProps) {
  return (
    <svg
      viewBox="0 0 20 18"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={base(className)}
      aria-hidden="true"
    >
      <path d="M5 7V1.5h10V7M5 13H3.5a2 2 0 0 1-2-2V8a1 1 0 0 1 1-1h15a1 1 0 0 1 1 1v3a2 2 0 0 1-2 2H15" />
      <rect x="5" y="11" width="10" height="6" />
    </svg>
  );
}

export function Spark({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="currentColor"
      className={base(className)}
      aria-hidden="true"
    >
      <path d="M6 0l1.2 4.8L12 6 7.2 7.2 6 12 4.8 7.2 0 6l4.8-1.2z" />
    </svg>
  );
}
