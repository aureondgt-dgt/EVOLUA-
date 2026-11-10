import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useRef, useState } from "react";

const chapters = [
  {
    number: "01",
    kicker: "DESENVOLVIMENTO PESSOAL",
    title: "Clareza",
    suffix: "para olhar para dentro.",
    description: "Objetivos, propósito, persistência e comunicação: temas para pausar, refletir e escolher o que faz sentido na sua jornada.",
  },
  {
    number: "02",
    kicker: "COACHING",
    title: "Repertório",
    suffix: "para explorar novas ideias.",
    description: "E-books, mapas mentais, artigos e recursos gráficos em diferentes formatos, reunidos no mesmo universo de consulta.",
  },
  {
    number: "03",
    kicker: "GRUPO EVOLUA+",
    title: "Conexão",
    suffix: "para compartilhar a jornada.",
    description: "O bônus abre espaço para experiências e conversas entre membros sobre os conteúdos apresentados.",
  },
];

function StaticChapters() {
  return (
    <section className="story-static" aria-label="Uma experiência em três movimentos">
      {chapters.map((chapter, index) => (
        <article className={`story-static__chapter story-static__chapter--${index}`} key={chapter.title}>
          <div className="story-static__media">
            {index === 0 && <img src="/images/marble-sculpture.jpg" alt="Escultura clássica em mármore" loading="lazy" />}
            {index === 1 && (
              <div className="story-split">
                <img src="/images/development-cover.jpg" alt="Arte do pack Desenvolvimento Pessoal" loading="lazy" />
                <img src="/images/coaching-cover.jpg" alt="Arte do pack Coaching" loading="lazy" />
              </div>
            )}
            {index === 2 && <img src="/images/community-sculpture.jpg" alt="Esculturas dispostas em círculo representando a comunidade" loading="lazy" />}
          </div>
          <div className="story-static__copy">
            <span>{chapter.number} / 03 — {chapter.kicker}</span>
            <h2>{chapter.title}</h2>
            <h3>{chapter.suffix}</h3>
            <p>{chapter.description}</p>
          </div>
        </article>
      ))}
    </section>
  );
}

export default function StoryScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = value < 0.32 ? 0 : value < 0.66 ? 1 : 2;
    setActive((current) => (current === next ? current : next));
  });

  const opacity0 = useTransform(scrollYProgress, [0, 0.24, 0.34], [1, 1, 0]);
  const opacity1 = useTransform(scrollYProgress, [0.25, 0.35, 0.58, 0.68], [0, 1, 1, 0]);
  const opacity2 = useTransform(scrollYProgress, [0.58, 0.69, 1], [0, 1, 1]);
  const scale0 = useTransform(scrollYProgress, [0, 0.34], [1.02, 1.17]);
  const scale1 = useTransform(scrollYProgress, [0.25, 0.68], [1.16, 1.02]);
  const scale2 = useTransform(scrollYProgress, [0.58, 1], [1.15, 1.02]);
  const clip1 = useTransform(scrollYProgress, [0.25, 0.36], ["inset(100% 0% 0% 0%)", "inset(0% 0% 0% 0%)"]);
  const clip2 = useTransform(scrollYProgress, [0.58, 0.7], ["inset(0% 0% 0% 100%)", "inset(0% 0% 0% 0%)"]);
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  if (reducedMotion) return <StaticChapters />;

  const goToChapter = (index: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const available = section.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: section.offsetTop + available * (index / (chapters.length - 1)),
      behavior: "smooth",
    });
  };

  const sceneStyles = [
    { opacity: opacity0, scale: scale0 },
    { opacity: opacity1, scale: scale1, clipPath: clip1 },
    { opacity: opacity2, scale: scale2, clipPath: clip2 },
  ];

  return (
    <section className="story" ref={sectionRef} aria-label="Uma experiência em três movimentos">
      <div className="story__sticky">
        <div className="story__scenes" aria-hidden="true">
          <motion.div className="story-scene story-scene--statue" style={sceneStyles[0]}>
            <img src="/images/marble-sculpture.jpg" alt="" loading="lazy" />
          </motion.div>
          <motion.div className="story-scene story-scene--packs" style={sceneStyles[1]}>
            <div className="story-split">
              <div><img src="/images/development-cover.jpg" alt="" loading="lazy" /></div>
              <div><img src="/images/coaching-cover.jpg" alt="" loading="lazy" /></div>
            </div>
          </motion.div>
          <motion.div className="story-scene story-scene--community" style={sceneStyles[2]}>
            <img src="/images/community-sculpture.jpg" alt="" loading="lazy" />
          </motion.div>
          <div className="story__vignette" />
        </div>

        <div className="story__top page-shell">
          <span>EVOLUA+ / A EXPERIÊNCIA</span>
          <span>APRENDA. EVOLUA. CONQUISTE.</span>
        </div>

        <div className="story__copy page-shell" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 50, rotateX: -8 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: -28 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="story__chapter"
            >
              <div className="story__chapter-meta">
                <span>{chapters[active].number}</span>
                <span>{chapters[active].kicker}</span>
              </div>
              <h2>{chapters[active].title}<span>.</span></h2>
              <h3>{chapters[active].suffix}</h3>
              <p>{chapters[active].description}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="story__progress">
          {chapters.map((chapter, index) => (
            <button
              type="button"
              key={chapter.title}
              className={active === index ? "is-active" : ""}
              onClick={() => goToChapter(index)}
              aria-label={`Ir para capítulo ${chapter.number}: ${chapter.title}`}
              aria-current={active === index ? "step" : undefined}
            >
              <span>{chapter.number}</span>
              <i />
            </button>
          ))}
        </div>

        <div className="story__bottom page-shell">
          <span><ArrowDown size={14} /> ROLE PARA EXPLORAR</span>
          <div><motion.i style={{ scaleX: lineScale }} /></div>
          <span>0{active + 1} / 03</span>
        </div>
      </div>
    </section>
  );
}
