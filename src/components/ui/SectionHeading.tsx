import type { ReactNode } from 'react';

interface SectionHeadingProps {
  index: string;
  label: string;
  title: ReactNode;
  lead?: ReactNode;
  id?: string;
}

export function SectionHeading({ index, label, title, lead, id }: SectionHeadingProps) {
  return (
    <div className="section-head">
      <div>
        <p className="section-head__index">
          <span>
            {index} — {label}
          </span>
        </p>
      </div>
      <div>
        <h2 className="section-title section-head__title" id={id} data-reveal>
          {title}
        </h2>
        {lead ? (
          <p className="body-copy section-head__lead" data-reveal data-delay="0.08">
            {lead}
          </p>
        ) : null}
      </div>
    </div>
  );
}
