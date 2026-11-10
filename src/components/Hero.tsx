import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowDown,
  ArrowDownRight,
  BookOpen,
  BrainCircuit,
  Check,
  Users,
} from "lucide-react";
import { type CSSProperties, type PointerEvent, useRef } from "react";
import type { PackType } from "../data";
import { BuyButton } from "./UI";

const bookContent = {
  desenvolvimento: {
    image: "/images/development-cover.jpg",
    title: "Desenvolvimento Pessoal",
    lines: ["Desenvolvimento", "Pessoal"],
  },
  coaching: {
    image: "/images/coaching-cover.jpg",
    title: "Coaching",
    lines: ["Coaching"],
  },
};

export function Book3D({
  pack,
  className = "",
}: {
  pack: PackType;
  className?: string;
}) {
  const book = bookContent[pack];
  return (
    <div className={`book-3d ${className}`} role="img" aria-label={`Livro digital ${book.title}`}>
      <div className="book-3d__inner">
        <div className="book-3d__back" />
        <div className="book-3d__pages" />
        <div className="book-3d__spine">
          <span>EVOLUA+</span>
        </div>
        <div className="book-3d__front">
          <img src={book.image} alt="" draggable="false" />
          <div className="book-3d__shade" />
          <div className="book-3d__copy">
            <span className="book-3d__edition">DIGITAL EDITION</span>
            <strong>
              {book.lines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </strong>
            <span className="book-3d__brand">EVOLUA<span>+</span></span>
          </div>
          <div className="book-3d__gloss" />
        </div>
      </div>
    </div>
  );
}

const railItems = [
  {
    href: "#receba",
    icon: BookOpen,
    title: "Desenvolvimento Pessoal",
    text: "Objetivos, persistência, gratidão e mais.",
  },
  {
    href: "#receba",
    icon: BrainCircuit,
    title: "Coaching",
    text: "E-books, mapas mentais e materiais de consulta.",
  },
  {
    href: "#bonus",
    icon: Users,
    title: "Grupo Evolua+",
    text: "Experiências e conversas entre membros.",
  },
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateY = useSpring(pointerX, { stiffness: 90, damping: 24 });
  const rotateX = useSpring(pointerY, { stiffness: 90, damping: 24 });
  const sceneY = useTransform(scrollYProgress, [0, 1], [0, 170]);
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const statueY = useTransform(scrollYProgress, [0, 1], [0, 95]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.82], [1, 0]);
  const ringScale = useTransform(scrollYProgress, [0, 1], [1, 1.32]);
  const ringOpacity = useTransform(scrollYProgress, [0, 1], [0.75, 0.15]);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    pointerX.set(x * 7);
    pointerY.set(y * -5);
  };

  const resetPointer = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <section id="inicio" className="hero" ref={sectionRef} aria-labelledby="hero-title">
      <div className="hero__ambient" aria-hidden="true">
        <div className="hero__glow hero__glow--one" />
        <div className="hero__glow hero__glow--two" />
        <div className="hero__grid" />
        {Array.from({ length: 22 }, (_, index) => (
          <span
            className="hero-particle"
            key={index}
            style={
              {
                left: `${(index * 41 + 7) % 98}%`,
                top: `${(index * 47 + 11) % 88}%`,
                "--particle-delay": `${-(index % 8) * 1.2}s`,
                "--particle-duration": `${8 + (index % 6) * 1.6}s`,
                "--particle-size": `${index % 4 === 0 ? 3 : 1.5}px`,
              } as CSSProperties
            }
          />
        ))}
      </div>

      <motion.div
        className="hero-scene"
        style={reducedMotion ? undefined : { y: sceneY, scale: sceneScale }}
        onPointerMove={handlePointerMove}
        onPointerLeave={resetPointer}
        aria-label="Composição artística Evolua+"
      >
        <motion.div
          className="hero-scene__perspective"
          style={reducedMotion ? undefined : { rotateX, rotateY }}
        >
          <motion.div
            className="hero-halo"
            style={reducedMotion ? undefined : { scale: ringScale, opacity: ringOpacity }}
            aria-hidden="true"
          >
            <span />
            <span />
          </motion.div>
          <motion.div
            className="hero-statue"
            style={reducedMotion ? undefined : { y: statueY }}
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 1.08, x: 45 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <img
              src="/images/marble-sculpture.jpg"
              alt="Escultura clássica em mármore iluminada em branco e prata"
              fetchPriority="high"
              draggable="false"
            />
          </motion.div>

          <motion.div
            className="hero-books"
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 90, rotateZ: 3 }}
            animate={{ opacity: 1, y: 0, rotateZ: 0 }}
            transition={{ duration: 1.25, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="hero-book hero-book--development">
              <Book3D pack="desenvolvimento" />
            </div>
            <div className="hero-book hero-book--coaching">
              <Book3D pack="coaching" />
            </div>
          </motion.div>

          <motion.div
            className="hero-community"
            initial={{ opacity: 0, y: 25, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="hero-community__orb" aria-hidden="true">
              <span /><span /><span />
              <Users size={23} strokeWidth={1.5} />
            </div>
            <div>
              <strong>Grupo Exclusivo</strong>
              <span>Bônus Evolua+</span>
            </div>
          </motion.div>
          <div className="hero-fragment hero-fragment--one" aria-hidden="true" />
          <div className="hero-fragment hero-fragment--two" aria-hidden="true" />
          <div className="hero-fragment hero-fragment--three" aria-hidden="true" />
        </motion.div>
      </motion.div>

      <motion.div
        className="hero__content page-shell"
        style={reducedMotion ? undefined : { y: copyY, opacity: copyOpacity }}
      >
        <motion.div
          className="hero__copy"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1, delayChildren: 0.25 } },
          }}
        >
          <motion.div
            className="hero__eyebrow"
            variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.6 }}
          >
            <span className="eyebrow-gem" aria-hidden="true" />
            CONHECIMENTO QUE TRANSFORMA
          </motion.div>

          <h1 id="hero-title">
            <span className="hero-title-mask">
              <motion.span
                variants={{ hidden: { y: "110%" }, visible: { y: "0%" } }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              >
                Seu próximo nível
              </motion.span>
            </span>
            <span className="hero-title-mask hero-title-mask--silver">
              <motion.span
                variants={{ hidden: { y: "110%" }, visible: { y: "0%" } }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              >
                começa agora.
              </motion.span>
            </span>
          </h1>

          <motion.p
            className="hero__subtitle"
            variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.75 }}
          >
            Conhecimento, desenvolvimento pessoal e coaching reunidos em uma experiência digital.
          </motion.p>

          <motion.div
            className="hero__action-row"
            variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.75 }}
          >
            <BuyButton className="hero__buy">QUERO GARANTIR MEU ACESSO</BuyButton>
            <div className="hero-price">
              <data value="57.90">R$ 57,90</data>
              <small>2 packs + grupo bônus</small>
              <span>Pagamento único</span>
            </div>
          </motion.div>

          <motion.ul
            className="hero__facts"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            transition={{ duration: 0.8 }}
          >
            {["Dois packs digitais", "Grupo Evolua+ como bônus", "Compra pelo WhatsApp"].map((fact) => (
              <li key={fact}><Check size={13} aria-hidden="true" />{fact}</li>
            ))}
          </motion.ul>
        </motion.div>
      </motion.div>

      <motion.div
        className="hero-rail page-shell"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 1.25, ease: [0.22, 1, 0.36, 1] }}
      >
        {railItems.map((item) => {
          const Icon = item.icon;
          return (
            <a href={item.href} key={item.title} className="hero-rail__item">
              <Icon size={29} strokeWidth={1.25} aria-hidden="true" />
              <span><strong>{item.title}</strong><small>{item.text}</small></span>
              <ArrowDownRight size={18} aria-hidden="true" />
            </a>
          );
        })}
      </motion.div>

      <a className="hero-scroll" href="#produtos" aria-label="Rolar para conhecer o Evolua+">
        <span>INVISTA EM VOCÊ</span>
        <ArrowDown size={17} aria-hidden="true" />
      </a>
    </section>
  );
}
