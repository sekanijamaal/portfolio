import { useRef, useState } from 'react';
import { site } from '../../data/site';
import { ArrowUpRight, Check, Mail, Github, Linkedin } from '../ui/icons';

type FieldName = 'name' | 'email' | 'type' | 'message';

interface FormState {
  name: string;
  email: string;
  type: string;
  message: string;
  company: string;
}

const initialForm: FormState = {
  name: '',
  email: '',
  type: 'Software product',
  message: '',
  company: '',
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function Contact() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const update = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (field === 'company' || !current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
    setSubmitted(false);
  };

  const validate = (): Partial<Record<FieldName, string>> => {
    const next: Partial<Record<FieldName, string>> = {};
    if (form.name.trim().length < 2) {
      next.name = 'Please share a name I can reply to.';
    }
    if (!emailPattern.test(form.email.trim())) {
      next.email = 'Enter a valid email address.';
    }
    if (form.message.trim().length < 12) {
      next.message = 'A sentence or two gives me something to work with.';
    }
    return next;
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (form.company) return;

    const found = validate();
    setErrors(found);

    if (Object.keys(found).length > 0) {
      const first = Object.keys(found)[0];
      const field = formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`);
      field?.focus();
      return;
    }

    const subject = `Portfolio enquiry — ${form.type}`;
    const body = [
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Project type: ${form.type}`,
      '',
      form.message,
    ].join('\n');

    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
  };

  return (
    <section id="contact" className="section contact" aria-labelledby="contact-heading">
      <div className="shell">
        <div className="section-head">
          <div>
            <p className="section-head__index">06 — Contact</p>
          </div>
          <div>
            <h2 className="contact__title" id="contact-heading" data-reveal>
              Have something <span className="text-champagne">worth building?</span>
            </h2>
          </div>
        </div>

        <div className="contact__grid">
          <div data-reveal>
            <p className="body-copy contact__copy">
              Whether it&apos;s a software product, cloud architecture,
              infrastructure automation, or an interesting engineering challenge,
              I&apos;d love to hear about it.
            </p>

            <div className="contact__links">
              <a className="contact__link" href={`mailto:${site.email}`}>
                <span className="contact__link-label">Email</span>
                <span className="contact__link-value">
                  <Mail className="h-3.5 w-3.5" />
                  {site.email}
                  <ArrowUpRight className="h-3.5 w-3.5 text-champagne" />
                </span>
              </a>
              <a
                className="contact__link"
                href={site.linkedin}
                target="_blank"
                rel="noreferrer"
              >
                <span className="contact__link-label">LinkedIn</span>
                <span className="contact__link-value">
                  <Linkedin className="h-3.5 w-3.5" />
                  {site.linkedinHandle}
                  <ArrowUpRight className="h-3.5 w-3.5 text-champagne" />
                </span>
              </a>
              <a
                className="contact__link"
                href={site.github}
                target="_blank"
                rel="noreferrer"
              >
                <span className="contact__link-label">GitHub</span>
                <span className="contact__link-value">
                  <Github className="h-3.5 w-3.5" />
                  {site.githubHandle}
                  <ArrowUpRight className="h-3.5 w-3.5 text-champagne" />
                </span>
              </a>
            </div>

            <p className="mt-8 max-w-[36ch] text-[10px] leading-relaxed text-muted">
              The form below composes an email in your own mail client. Nothing is
              sent to, or stored on, a server from this page.
            </p>
          </div>

          <form
            ref={formRef}
            className="form"
            onSubmit={onSubmit}
            noValidate
            data-reveal
            data-delay="0.08"
          >
            <div className="form__row">
              <div className="field" data-invalid={Boolean(errors.name)}>
                <label htmlFor="contact-name">Name</label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(event) => update('name', event.target.value)}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'contact-name-error' : undefined}
                />
                {errors.name ? (
                  <span className="field__error" id="contact-name-error">
                    {errors.name}
                  </span>
                ) : null}
              </div>

              <div className="field" data-invalid={Boolean(errors.email)}>
                <label htmlFor="contact-email">Email</label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={(event) => update('email', event.target.value)}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'contact-email-error' : undefined}
                />
                {errors.email ? (
                  <span className="field__error" id="contact-email-error">
                    {errors.email}
                  </span>
                ) : null}
              </div>
            </div>

            <div className="field">
              <label htmlFor="contact-type">What is this about?</label>
              <select
                id="contact-type"
                name="type"
                value={form.type}
                onChange={(event) => update('type', event.target.value)}
              >
                <option>Software product</option>
                <option>Cloud architecture</option>
                <option>Infrastructure automation</option>
                <option>Technical collaboration</option>
                <option>Something else</option>
              </select>
            </div>

            <div className="field" data-invalid={Boolean(errors.message)}>
              <label htmlFor="contact-message">Message</label>
              <textarea
                id="contact-message"
                name="message"
                placeholder="A little context, the problem, and what a good outcome looks like."
                value={form.message}
                onChange={(event) => update('message', event.target.value)}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? 'contact-message-error' : undefined}
              />
              {errors.message ? (
                <span className="field__error" id="contact-message-error">
                  {errors.message}
                </span>
              ) : null}
            </div>

            <div className="form__honeypot" aria-hidden="true">
              <label htmlFor="contact-company">Company</label>
              <input
                id="contact-company"
                name="company"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={form.company}
                onChange={(event) => update('company', event.target.value)}
              />
            </div>

            <div className="form__foot">
              <p className="form__note">
                No mailing list. No automated follow-up. Just a direct email.
              </p>
              <button type="submit" className="btn btn-solid">
                Start a conversation
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div aria-live="polite">
              {submitted ? (
                <p className="form__success">
                  <Check className="h-4 w-4" />
                  <span>
                    Your email client should be opening with the message ready to
                    send. If nothing happens, write directly to{' '}
                    <a className="link-slide text-champagne" href={`mailto:${site.email}`}>
                      {site.email}
                    </a>
                    .
                  </span>
                </p>
              ) : null}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
