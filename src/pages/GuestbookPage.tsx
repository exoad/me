import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import SEO from '../components/SEO';
import SubpageNav from '../components/SubpageNav';
import { strings } from '../data/shared';
import { MdSend, MdChevronLeft, MdChevronRight, MdAdd, MdClose } from 'react-icons/md';

interface GuestbookEntry {
  id: number;
  name: string;
  message: string;
  created_at: string;
}

interface GuestbookResponse {
  entries: GuestbookEntry[];
  totalEntries?: number;
  totalPages: number;
  currentPage: number;
}

type StatusMessage = {
  text: string;
  ok: boolean;
};

const MESSAGE_MAX_LENGTH = 600;
const TURNSTILE_SITE_KEY = '0x4AAAAAADRVTMltusSmfuQN';
const LINK_PATTERN = /((?:https?:\/\/|www\.)[^\s<>"']+)/gi;
const LINK_PART_PATTERN = /^(?:https?:\/\/|www\.)[^\s<>"']+$/i;
let turnstileScriptPromise: Promise<void> | null = null;

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          theme: 'dark' | 'light' | 'auto';
          callback: (token: string) => void;
          'expired-callback': () => void;
          'error-callback': () => void;
        },
      ) => string;
      remove: (widgetId: string) => void;
      reset: (widgetId?: string) => void;
    };
  }
}

function loadTurnstileScript() {
  if (window.turnstile) return Promise.resolve();
  if (turnstileScriptPromise) return turnstileScriptPromise;

  turnstileScriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>('script[src*="turnstile"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(), { once: true });
      existingScript.addEventListener('error', () => reject(new Error('Turnstile failed to load')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    script.addEventListener('load', () => resolve(), { once: true });
    script.addEventListener('error', () => reject(new Error('Turnstile failed to load')), { once: true });
    document.head.appendChild(script);
  });

  return turnstileScriptPromise;
}

export default function GuestbookPage() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [entriesError, setEntriesError] = useState('');
  const [name, setName] = useState('');
  const [msgText, setMsgText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<StatusMessage | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  const turnstileContainerRef = useRef<HTMLDivElement | null>(null);
  const turnstileWidgetIdRef = useRef<string | null>(null);
  const formToggleRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const dialogCloseRef = useRef<HTMLButtonElement | null>(null);

  const loadEntriesForPage = useCallback(async (p: number) => {
    setLoading(true);
    setEntriesError('');
    try {
      const res = await window.fetch('/api/guestbook/list?page=' + p + '&limit=20');
      let data: GuestbookResponse;
      if (res.ok) {
        data = await res.json();
      } else {
        data = { entries: [], totalPages: 1, currentPage: p };
        setEntriesError('Could not load entries right now.');
      }
      setEntries(data.entries || []);
      setTotalPages(data.totalPages || 1);
    } catch (e) {
      console.error(e);
      setEntries([]);
      setEntriesError('Could not load entries right now.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (window.scrollY > 0) window.scrollTo({ top: 0 });
    loadEntriesForPage(page);
  }, [loadEntriesForPage, page]);

  useEffect(() => {
    if (!formOpen) {
      setTurnstileToken('');
      return;
    }

    let cancelled = false;

    loadTurnstileScript()
      .then(() => {
        if (cancelled || !window.turnstile || !turnstileContainerRef.current || turnstileWidgetIdRef.current) return;

        turnstileWidgetIdRef.current = window.turnstile.render(turnstileContainerRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          theme: 'dark',
          callback: (token) => {
            setTurnstileToken(token);
            setStatusMsg((current) => (current && !current.ok ? null : current));
          },
          'expired-callback': () => setTurnstileToken(''),
          'error-callback': () => setTurnstileToken(''),
        });
      })
      .catch(() => {
        setStatusMsg({ text: 'Could not load verification. Please refresh and try again.', ok: false });
      });

    return () => {
      cancelled = true;
      setTurnstileToken('');
      if (window.turnstile && turnstileWidgetIdRef.current) {
        window.turnstile.remove(turnstileWidgetIdRef.current);
        turnstileWidgetIdRef.current = null;
      }
    };
  }, [formOpen]);

  useEffect(() => {
    if (!statusMsg?.ok) return;
    dialogCloseRef.current?.focus();
  }, [statusMsg]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim() || !msgText.trim()) return;

    if (!turnstileToken) {
      setStatusMsg({ text: 'Please complete the verification.', ok: false });
      return;
    }

    setSubmitting(true);

    try {
      const res = await window.fetch('/api/guestbook/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), message: msgText.trim(), turnstileToken }),
      });

      const data = await res.json();

      if (res.ok) {
        setName('');
        setMsgText('');
        setFormOpen(false);
        setStatusMsg({
          text: data.message || 'Your note is on its way. I will give it a quick look and approve it soon.',
          ok: true,
        });
        setTurnstileToken('');
      } else {
        setStatusMsg({ text: data.error || strings.pages.guestbook.error_submit, ok: false });
        if (window.turnstile && turnstileWidgetIdRef.current) {
          window.turnstile.reset(turnstileWidgetIdRef.current);
          setTurnstileToken('');
        }
      }
    } catch (err) {
      setStatusMsg({ text: String(strings.pages.guestbook.error_submit), ok: false });
    } finally {
      setSubmitting(false);
    }
  };

  const closeSuccessDialog = () => {
    setStatusMsg(null);
    formToggleRef.current?.focus();
  };

  const handleDialogKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeSuccessDialog();
      return;
    }

    if (event.key !== 'Tab' || !dialogRef.current) return;

    const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(new Date(dateStr));
    } catch (e) {
      return dateStr;
    }
  };

  const messageTextClass = (message: string) => {
    if (message.length > 360) return 'text-base sm:text-lg';
    if (message.length > 180) return 'text-[17px] sm:text-lg';
    return 'text-lg sm:text-xl';
  };

  const renderMessage = (message: string): ReactNode[] => {
    return message.split(LINK_PATTERN).map((part, index) => {
      if (!LINK_PART_PATTERN.test(part)) return part;

      const href = part.startsWith('www.') ? `https://${part}` : part;
      try {
        const url = new URL(href);
        if (url.protocol !== 'http:' && url.protocol !== 'https:') return part;
      } catch {
        return part;
      }

      return (
        <a
          key={`${part}-${index}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="text-yellow underline decoration-yellow/35 underline-offset-4 transition-colors duration-200 hover:text-fg0 hover:decoration-yellow"
        >
          {part}
        </a>
      );
    });
  };

  return (
    <>
      <SEO
        title={strings.pages.guestbook.title}
        description={strings.pages.guestbook.description}
        url="https://exoad.net/guestbook"
      />
      <main id="main" className="min-h-screen bg-bg0 px-[calc(var(--spacing)*_6)] py-[calc(var(--spacing)*_10)] sm:px-[calc(var(--spacing)*_8)] md:px-[calc(var(--spacing)*_16)] md:py-[calc(var(--spacing)*_16)]">
        <div className="mx-auto w-full max-w-xl">
          <SubpageNav />

          <header className="mb-[calc(var(--spacing)*_8)] animate-fade-in-up">
            <p className="text-fg4 font-sans uppercase tracking-[0.2em] text-[10px] mb-[calc(var(--spacing)*_4)]">
              Guest Book
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-fg0 mb-[calc(var(--spacing)*_3)]">
              {strings.pages.guestbook.title}
            </h1>
            <p className="text-fg3 text-sm font-sans leading-relaxed max-w-lg">
              {strings.pages.guestbook.description}
            </p>
          </header>

          <section className="mb-[calc(var(--spacing)*_12)] border-y border-bg2 animate-fade-in-up" style={{ animationDelay: '60ms' }}>
            <button
              ref={formToggleRef}
              type="button"
              onClick={() => { setStatusMsg((current) => current?.ok ? current : null); setFormOpen((open) => !open); }}
              className="group flex w-full items-center justify-between gap-4 py-[calc(var(--spacing)*_5)] text-left transition-colors duration-300 hover:text-fg0"
              aria-expanded={formOpen}
              aria-controls="guestbook-form"
            >
              <span>
                <span className="block text-fg0 font-bold text-lg">
                  {formOpen ? 'Hide signing form' : 'Sign the guestbook'}
                </span>
                <span className="block text-fg4 text-xs font-sans mt-1">
                  Leave a lighthearted note, a hello, or a tiny internet footprint.
                </span>
              </span>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-yellow text-bg0 transition-all duration-300 group-hover:scale-105 group-hover:opacity-80">
                {formOpen ? <MdClose size={20} /> : <MdAdd size={20} />}
              </span>
            </button>

            {formOpen && (
              <form
                id="guestbook-form"
                onSubmit={handleSubmit}
                className="animate-fade-in-up pb-[calc(var(--spacing)*_6)]"
              >
                <div className="mb-[calc(var(--spacing)*_4)]">
                  <label htmlFor="guestbook-name" className="block text-xs uppercase tracking-wide text-fg4 mb-[calc(var(--spacing)*_2)] font-sans">
                    {strings.pages.guestbook.name_label}
                  </label>
                  <input
                    id="guestbook-name"
                    name="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={100}
                    required
                    placeholder="Your name"
                    className="w-full bg-bg1 border border-bg3 rounded-sm px-3 py-2 text-fg placeholder:text-fg4 focus:border-yellow"
                  />
                </div>

                <div className="mb-[calc(var(--spacing)*_4)]">
                  <label htmlFor="guestbook-message" className="block text-xs uppercase tracking-wide text-fg4 mb-[calc(var(--spacing)*_2)] font-sans">
                    {strings.pages.guestbook.message_label}
                  </label>
                  <textarea
                    id="guestbook-message"
                    name="message"
                    value={msgText}
                    onChange={(e) => setMsgText(e.target.value)}
                    maxLength={MESSAGE_MAX_LENGTH}
                    required
                    rows={4}
                    placeholder="Leave a message"
                    aria-describedby="guestbook-message-count"
                    className="w-full resize-y bg-bg1 border border-bg3 rounded-sm px-3 py-2 text-fg placeholder:text-fg4 focus:border-yellow"
                  />
                  <div id="guestbook-message-count" className="mt-2 text-right font-sans text-[11px] text-fg4">
                    {msgText.length}/{MESSAGE_MAX_LENGTH}
                  </div>
                </div>

                <p className="mb-2 text-xs text-fg4 font-sans">Verification appears only when signing.</p>
                <div
                  ref={turnstileContainerRef}
                  className="cf-turnstile mb-[calc(var(--spacing)*_2)] min-h-[65px]"
                />

                {statusMsg && !statusMsg.ok && (
                  <p className="mb-[calc(var(--spacing)*_4)] text-sm font-sans text-red" role="alert">
                    {statusMsg.text}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting || !name.trim() || !msgText.trim()}
                  className="inline-flex items-center gap-2 bg-yellow text-bg0 px-6 py-2 rounded-sm font-sans text-sm hover:opacity-80 transition-opacity disabled:opacity-50"
                >
                  <MdSend size={14} />
                  {submitting ? 'Submitting...' : strings.pages.guestbook.submit_button}
                </button>
              </form>
            )}
          </section>

          {statusMsg?.ok && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg0/80 px-6 backdrop-blur-sm animate-fade-in">
              <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="guestbook-success-title"
                onKeyDown={handleDialogKeyDown}
                className="w-full max-w-sm border border-bg2 bg-bg0 p-6 shadow-2xl animate-scale-in"
              >
                <p className="text-fg4 font-sans uppercase tracking-[0.2em] text-[10px] mb-4">
                  Guest Book
                </p>
                <h2 id="guestbook-success-title" className="text-2xl font-bold text-fg0 mb-3">Note received</h2>
                <p className="text-fg3 text-sm font-sans leading-relaxed mb-6">
                  {statusMsg.text}
                </p>
                <button
                  ref={dialogCloseRef}
                  type="button"
                  onClick={closeSuccessDialog}
                  className="bg-yellow text-bg0 px-5 py-2 rounded-sm font-sans text-sm hover:opacity-80 transition-opacity"
                >
                  Nice
                </button>
              </div>
            </div>
          )}

          <section className="animate-fade-in-up" style={{ animationDelay: '90ms' }}>
            <h2 className="text-fg4 font-sans uppercase tracking-[0.2em] text-[10px] mb-[calc(var(--spacing)*_5)]">
              Recent Entries
            </h2>

            {loading ? (
              <p className="text-fg4 text-sm font-sans" role="status" aria-live="polite">{strings.pages.guestbook.loading_entries}</p>
            ) : entriesError ? (
              <div className="text-sm font-sans text-fg3" role="alert">
                <p>{entriesError}</p>
                <button type="button" onClick={() => loadEntriesForPage(page)} className="mt-2 text-yellow hover:underline">
                  Try again
                </button>
              </div>
            ) : entries.length === 0 ? (
              <p className="text-fg3 text-sm font-sans">{strings.pages.guestbook.no_entries}</p>
            ) : (
              <div className="divide-y divide-bg2">
                {entries.map((entry, index) => (
                  <article
                    key={entry.id}
                    className="group relative animate-fade-in-up py-[calc(var(--spacing)*_7)] transition-colors duration-200 first:pt-0"
                    style={{ animationDelay: `${Math.min(index * 24, 120)}ms` }}
                  >
                    <span className={`absolute right-0 font-sans text-[10px] tracking-[0.18em] text-fg4/45 ${index === 0 ? 'top-0' : 'top-[calc(var(--spacing)*_7)]'}`}>
                      {String((page - 1) * 20 + index + 1).padStart(2, '0')}
                    </span>
                    <blockquote className="relative pr-[calc(var(--spacing)*_8)]">
                      <span className="pointer-events-none absolute -left-1 top-[-0.35rem] font-serif text-5xl leading-none text-yellow/25">
                        &ldquo;
                      </span>
                      <p className={`relative pl-[calc(var(--spacing)*_5)] leading-relaxed text-fg0 whitespace-pre-wrap break-words ${messageTextClass(entry.message)}`}>
                        {renderMessage(entry.message)}
                      </p>
                      <footer className="mt-[calc(var(--spacing)*_4)] flex flex-col gap-2 pl-[calc(var(--spacing)*_5)] font-sans sm:flex-row sm:items-center sm:justify-between">
                        <span className="inline-flex items-center gap-2 text-sm font-semibold text-fg2">
                          <span className="h-px w-5 bg-yellow/70 transition-colors duration-200 group-hover:bg-yellow" />
                          <cite className="not-italic transition-colors duration-200 group-hover:text-yellow">
                            {entry.name}
                          </cite>
                        </span>
                        <time className="text-[11px] uppercase tracking-[0.14em] text-fg4">
                          {formatDate(entry.created_at)}
                        </time>
                      </footer>
                    </blockquote>
                  </article>
                ))}
              </div>
            )}
          </section>

          <nav className="mt-[calc(var(--spacing)*_8)] flex items-center justify-center gap-4 text-sm font-sans" aria-label="Guestbook entries pagination">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="inline-flex items-center gap-1 text-fg4 hover:text-yellow transition-colors disabled:opacity-40 disabled:hover:text-fg4"
            >
              <MdChevronLeft size={18} />
              Prev
            </button>
            <span className="text-fg4" aria-current="page">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="inline-flex items-center gap-1 text-fg4 hover:text-yellow transition-colors disabled:opacity-40 disabled:hover:text-fg4"
            >
              Next
              <MdChevronRight size={18} />
            </button>
          </nav>
        </div>
      </main>
    </>
  );
}
