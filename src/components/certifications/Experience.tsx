import { CERTIFICATIONS } from '../../data/certifications';
import { SectionHeading } from '../ui/SectionHeading';
import { ArrowUpRight, Check } from '../ui/icons';

export function Experience() {
  return (
    <section id="experience" className="section" aria-labelledby="experience-heading">
      <div className="shell">
        <SectionHeading
          index="05"
          label="Credentials"
          id="experience-heading"
          title={
            <>
              Certified, and{' '}
              <span className="text-champagne">still studying.</span>
            </>
          }
          lead="Two AWS certifications sit underneath the cloud work: a foundational understanding of the platform, and an associate-level validation of architecture decisions."
        />

        <div className="cert-grid">
          {CERTIFICATIONS.map((certification) => (
            <article
              key={certification.id}
              className={`cert-card ${
                certification.emphasis === 'primary'
                  ? 'cert-card--primary'
                  : 'cert-card--secondary'
              }`}
              data-reveal
            >
              <div className="cert-card__top">
                <span className="cert-card__level">
                  {certification.level} · {certification.issuer}
                </span>
                <span className="cert-card__seal" aria-hidden="true">
                  <span>{certification.id === 'saa' ? 'SAA' : 'CCP'}</span>
                </span>
              </div>

              <h3 className="cert-card__name">{certification.name}</h3>
              <p className="cert-card__issuer">Amazon Web Services</p>
              <p className="cert-card__description">{certification.description}</p>

              <div className="cert-card__focus" aria-label="Certification focus areas">
                {certification.focus.map((item) => (
                  <span className="chip" key={item}>
                    <Check className="mr-1.5 h-2.5 w-2.5 text-champagne" />
                    {item}
                  </span>
                ))}
              </div>

              <div className="cert-card__foot">
                <span className="cert-card__note">{certification.note}</span>
                <a
                  className="project__link"
                  href={certification.verificationUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Verify with AWS
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="cert-footnote">
          <span>
            Credential IDs and verification links can be supplied on request.
          </span>
          <span className="flex items-center gap-2 text-champagne">
            <Check className="h-3 w-3" />
            Amazon Web Services · Certified
          </span>
        </div>
      </div>
    </section>
  );
}
