import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import { ArrowUpRight, MessageCircle, X } from "lucide-react";
import {
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
  useEffect,
  useRef,
} from "react";
import { legalContent, type LegalType, WHATSAPP_URL } from "../data";
import { cn } from "../utils/cn";

export function Logo({ className, onClick }: { className?: string; onClick?: () => void }) {
  return (
    <a
      href="#inicio"
      onClick={onClick}
      className={cn("brand-logo", className)}
      aria-label="Evolua+ — voltar ao início"
    >
      EVOLUA<span>+</span>
    </a>
  );
}

type BuyButtonProps = {
  children?: ReactNode;
  className?: string;
  variant?: "light" | "outline" | "dark";
  compact?: boolean;
  onClick?: () => void;
};

export function BuyButton({
  children = "COMPRAR PELO WHATSAPP",
  className,
  variant = "light",
  compact = false,
  onClick,
}: BuyButtonProps) {
  return (
    <motion.a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noreferrer"
      onClick={onClick}
      className={cn("buy-button", `buy-button--${variant}`, compact && "buy-button--compact", className)}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.2 }}
      aria-label={`${typeof children === "string" ? children : "Comprar pelo WhatsApp"} — abrir em nova aba`}
    >
      <span className="buy-button__shine" aria-hidden="true" />
      <MessageCircle size={compact ? 16 : 19} strokeWidth={1.8} aria-hidden="true" />
      <span>{children}</span>
      <ArrowUpRight size={compact ? 16 : 19} strokeWidth={1.8} aria-hidden="true" />
    </motion.a>
  );
}

export function Reveal({
  children,
  className,
  delay = 0,
  amount = 0.16,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  amount?: number;
}) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 56, clipPath: "inset(0 0 18% 0)" }}
      whileInView={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }}
      viewport={{ once: true, amount }}
      transition={{ duration: reducedMotion ? 0.25 : 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <Reveal className={cn("section-heading", align === "center" && "section-heading--center", className)}>
      <div className="eyebrow">
        <span aria-hidden="true" />
        {eyebrow}
      </div>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </Reveal>
  );
}

export function SpotlightCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
  };

  return (
    <motion.article
      className={cn("spotlight-card", className)}
      onPointerMove={handlePointerMove}
      whileHover={{ y: -7 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      style={{ "--spot-x": "50%", "--spot-y": "0%" } as CSSProperties}
    >
      {children}
    </motion.article>
  );
}

export function LegalDialog({
  type,
  onClose,
}: {
  type: LegalType | null;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!type) return;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab") {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 80);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      window.clearTimeout(focusTimer);
      previousFocus?.focus();
    };
  }, [type, onClose]);

  return (
    <AnimatePresence>
      {type && (
        <motion.div
          className="legal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <motion.section
            ref={dialogRef}
            className="legal-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="legal-title"
            initial={{ opacity: 0, y: 34, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.985 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="legal-dialog__top">
              <Logo />
              <button ref={closeRef} type="button" onClick={onClose} aria-label="Fechar janela">
                <X size={22} />
              </button>
            </div>
            <div className="legal-dialog__content">
              <span className="legal-kicker">EVOLUA+ / INFORMAÇÕES</span>
              <h2 id="legal-title">{legalContent[type].title}</h2>
              <p className="legal-intro">{legalContent[type].intro}</p>
              {legalContent[type].sections.map((section) => (
                <div className="legal-section" key={section.heading}>
                  <h3>{section.heading}</h3>
                  <p>{section.text}</p>
                </div>
              ))}
              <button type="button" className="text-link legal-close" onClick={onClose}>
                Voltar ao site <ArrowUpRight size={16} />
              </button>
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
