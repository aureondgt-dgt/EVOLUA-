import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  BrainCircuit,
  Check,
  ChevronDown,
  Compass,
  Layers3,
  LibraryBig,
  Menu,
  MessageCircle,
  MessagesSquare,
  Users,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import Hero, { Book3D } from "./components/Hero";
import StoryScroll from "./components/StoryScroll";
import {
  BuyButton,
  LegalDialog,
  Logo,
  Reveal,
  SectionHeading,
  SpotlightCard,
} from "./components/UI";
import {
  benefits,
  conceptCards,
  coachingResources,
  developmentTopics,
  faqs,
  type LegalType,
  navItems,
  type PackType,
  purchaseSteps,
  WHATSAPP_URL,
} from "./data";

const ease = [0.22, 1, 0.36, 1] as const;

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <>
      <header className={`site-header ${scrolled ? "site-header--scrolled" : ""}`}>
        <div className="site-header__inner page-shell">
          <Logo onClick={() => setMenuOpen(false)} />
          <nav className="desktop-nav" aria-label="Navegação principal">
            {navItems.map((item) => (
              <a href={item.href} key={item.href}>{item.label}</a>
            ))}
          </nav>
          <a href="#oferta" className="header-cta">
            Quero evoluir <ArrowUpRight size={16} aria-hidden="true" />
          </a>
          <button
            type="button"
            className="menu-toggle"
            onClick={() => setMenuOpen((value) => !value)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {menuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            className="mobile-menu"
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.55, ease }}
          >
            <div className="mobile-menu__glow" aria-hidden="true" />
            <nav aria-label="Navegação móvel">
              {navItems.map((item, index) => (
                <motion.a
                  href={item.href}
                  key={item.href}
                  onClick={() => setMenuOpen(false)}
                  initial={{ opacity: 0, y: 35 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 + index * 0.07, duration: 0.5, ease }}
                >
                  <span>0{index + 1}</span>{item.label}<ArrowUpRight size={24} />
                </motion.a>
              ))}
            </nav>
            <motion.div
              className="mobile-menu__bottom"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <p>APRENDA. EVOLUA. CONQUISTE.</p>
              <BuyButton onClick={() => setMenuOpen(false)}>QUERO GARANTIR MEU ACESSO</BuyButton>
              <span>R$ 57,90 · Pagamento único</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function ConceptSection({ onSelectPack }: { onSelectPack: (pack: PackType) => void }) {
  const icons = [BookOpen, BrainCircuit, Users];
  return (
    <section id="produtos" className="concept section-pad">
      <div className="page-shell">
        <div className="concept__intro">
          <SectionHeading
            eyebrow="CONHEÇA O EVOLUA+"
            title={<>Conhecimento para acompanhar<br className="desktop-only" /> a sua <em>evolução.</em></>}
          />
          <Reveal delay={0.12} className="concept__lead">
            <p>O Evolua+ reúne materiais digitais voltados ao desenvolvimento pessoal e ao universo do coaching, organizados em uma única oferta.</p>
            <span>APRENDA. EVOLUA. CONQUISTE.</span>
          </Reveal>
        </div>

        <div className="concept__grid">
          {conceptCards.map((card, index) => {
            const Icon = icons[index];
            return (
              <Reveal key={card.title} delay={index * 0.1} amount={0.1}>
                <SpotlightCard className={`concept-card concept-card--${index + 1}`}>
                  <div className="concept-card__top">
                    <span>{card.number}</span>
                    <div className="concept-card__icon"><Icon size={28} strokeWidth={1.25} aria-hidden="true" /></div>
                  </div>
                  <span className="concept-card__label">{index === 2 ? "GRUPO EVOLUA+" : "PACK DIGITAL"}</span>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                  <ul>
                    {card.items.map((item) => <li key={item}><span>+</span>{item}</li>)}
                  </ul>
                  <a
                    href={card.href}
                    className="concept-card__link"
                    onClick={() => card.pack && onSelectPack(card.pack)}
                  >
                    {index === 2 ? "Conhecer o bônus" : "Explorar o pack"}
                    <ArrowRight size={17} aria-hidden="true" />
                  </a>
                </SpotlightCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ReceiveSection({
  activePack,
  setActivePack,
}: {
  activePack: PackType;
  setActivePack: (pack: PackType) => void;
}) {
  const items = activePack === "desenvolvimento" ? developmentTopics : coachingResources;
  const isDevelopment = activePack === "desenvolvimento";

  return (
    <section id="receba" className="receive section-pad">
      <div className="receive__halo" aria-hidden="true" />
      <div className="page-shell">
        <SectionHeading
          eyebrow="DENTRO DA OFERTA"
          title={<>O que você <em>recebe.</em></>}
          description="Explore os temas de Desenvolvimento Pessoal e os formatos de recursos identificados no pack Coaching."
          align="center"
        />

        <Reveal className="pack-tabs-wrap" delay={0.1}>
          <div className="pack-tabs" role="tablist" aria-label="Escolha um pack para explorar">
            <button
              type="button"
              role="tab"
              id="tab-desenvolvimento"
              aria-selected={isDevelopment}
              aria-controls="pack-panel"
              className={isDevelopment ? "is-active" : ""}
              onClick={() => setActivePack("desenvolvimento")}
            >
              <BookOpen size={18} strokeWidth={1.5} /> Desenvolvimento Pessoal
            </button>
            <button
              type="button"
              role="tab"
              id="tab-coaching"
              aria-selected={!isDevelopment}
              aria-controls="pack-panel"
              className={!isDevelopment ? "is-active" : ""}
              onClick={() => setActivePack("coaching")}
            >
              <BrainCircuit size={18} strokeWidth={1.5} /> Coaching
            </button>
            <motion.span
              className="pack-tabs__indicator"
              animate={{ x: isDevelopment ? "0%" : "100%" }}
              transition={{ duration: 0.45, ease }}
              aria-hidden="true"
            />
          </div>
        </Reveal>

        <div className="pack-showcase">
          <div className="pack-showcase__visual">
            <div className="pack-showcase__ring" aria-hidden="true" />
            <AnimatePresence mode="wait">
              <motion.div
                className="pack-showcase__book"
                key={activePack}
                initial={{ opacity: 0, rotateY: -28, x: -35 }}
                animate={{ opacity: 1, rotateY: 0, x: 0 }}
                exit={{ opacity: 0, rotateY: 24, x: 30 }}
                transition={{ duration: 0.55, ease }}
              >
                <Book3D pack={activePack} />
              </motion.div>
            </AnimatePresence>
            <div className="pack-showcase__caption">
              <span>{isDevelopment ? "PACK 01" : "PACK 02"}</span>
              <strong>{isDevelopment ? "Desenvolvimento Pessoal" : "Coaching"}</strong>
              <p>{isDevelopment ? "Temas para reflexão e desenvolvimento individual." : "Recursos em formatos variados para leitura e consulta."}</p>
            </div>
          </div>

          <div
            className="pack-showcase__content"
            id="pack-panel"
            role="tabpanel"
            aria-labelledby={isDevelopment ? "tab-desenvolvimento" : "tab-coaching"}
          >
            <AnimatePresence mode="wait">
              <motion.ol
                className="pack-list"
                key={activePack}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.035 } },
                  exit: { opacity: 0, y: -12, transition: { duration: 0.2 } },
                }}
              >
                {items.map((item, index) => (
                  <motion.li
                    key={item.title}
                    variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } }}
                  >
                    <span className="pack-list__number">{String(index + 1).padStart(2, "0")}</span>
                    <div><small>{item.category}</small><strong>{item.title}</strong></div>
                    <span className="pack-list__plus" aria-hidden="true">+</span>
                  </motion.li>
                ))}
              </motion.ol>
            </AnimatePresence>
          </div>
        </div>

        <Reveal className="receive__footer">
          <p>Consulte pelo WhatsApp as condições vigentes de acesso e entrega dos materiais.</p>
          <BuyButton variant="outline">QUERO O EVOLUA+ COMPLETO</BuyButton>
        </Reveal>
      </div>
    </section>
  );
}

function BonusSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], [-55, 55]);
  const orbitRotate = useTransform(scrollYProgress, [0, 1], [-12, 18]);

  return (
    <section id="bonus" className="bonus section-pad" ref={sectionRef}>
      <div className="page-shell bonus__grid">
        <Reveal className="bonus__visual-wrap">
          <div className="bonus__visual">
            <motion.img
              src="/images/community-sculpture.jpg"
              alt="Escultura de sete figuras em círculo, representando a comunidade Evolua+"
              loading="lazy"
              style={reducedMotion ? undefined : { y: imageY }}
            />
            <motion.div
              className="bonus__orbit"
              style={reducedMotion ? undefined : { rotate: orbitRotate }}
              aria-hidden="true"
            ><span /><span /></motion.div>
            <div className="bonus__chip bonus__chip--one"><Users size={16} />Comunidade de membros</div>
            <div className="bonus__chip bonus__chip--two"><MessagesSquare size={16} />Trocas e experiências</div>
            <span className="bonus__visual-label">BÔNUS / GRUPO EVOLUA+</span>
          </div>
        </Reveal>

        <div className="bonus__copy">
          <SectionHeading
            eyebrow="BÔNUS EXCLUSIVO"
            title={<>Você também fará parte de uma <em>comunidade.</em></>}
            description="Além dos materiais digitais, você terá acesso ao grupo exclusivo de membros para compartilhar experiências e conversar sobre os conteúdos."
          />
          <Reveal delay={0.12}>
            <ul className="bonus__list">
              <li><Users size={21} strokeWidth={1.4} /><div><strong>Comunidade de membros</strong><span>Um espaço apresentado para reunir participantes do Evolua+.</span></div></li>
              <li><MessagesSquare size={21} strokeWidth={1.4} /><div><strong>Compartilhamento de experiências</strong><span>Trocas sobre percepções e vivências relacionadas à jornada.</span></div></li>
              <li><BookOpen size={21} strokeWidth={1.4} /><div><strong>Conversas sobre os conteúdos</strong><span>Diálogo entre membros sobre os materiais que compõem a oferta.</span></div></li>
            </ul>
            <a className="text-link" href="#oferta">Ver a oferta completa <ArrowUpRight size={17} /></a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function BenefitsSection() {
  const iconMap = {
    library: LibraryBig,
    compass: Compass,
    layers: Layers3,
    messages: MessagesSquare,
  };
  return (
    <>
      <div className="slogan-strip" aria-label="Aprenda. Evolua. Conquiste.">
        <div className="slogan-strip__track" aria-hidden="true">
          {[0, 1].map((group) => (
            <span key={group}>APRENDA <i>+</i> EVOLUA <i>+</i> CONQUISTE <i>+</i>&nbsp;</span>
          ))}
        </div>
      </div>
      <section id="beneficios" className="benefits section-pad">
        <div className="page-shell">
          <div className="benefits__heading-row">
            <SectionHeading
              eyebrow="BENEFÍCIOS DA EXPERIÊNCIA"
              title={<>Uma experiência para<br />explorar no seu <em>ritmo.</em></>}
            />
            <Reveal delay={0.1}><p>Do primeiro tema à conversa com a comunidade, cada elemento tem um lugar dentro da proposta Evolua+.</p></Reveal>
          </div>
          <div className="benefits__grid">
            {benefits.map((benefit, index) => {
              const Icon = iconMap[benefit.icon as keyof typeof iconMap];
              return (
                <Reveal key={benefit.title} delay={index * 0.08} amount={0.1}>
                  <SpotlightCard className="benefit-card">
                    <div className="benefit-card__number">0{index + 1}</div>
                    <Icon size={30} strokeWidth={1.2} aria-hidden="true" />
                    <h3>{benefit.title}</h3>
                    <p>{benefit.description}</p>
                  </SpotlightCard>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

function OfferSection() {
  return (
    <section id="oferta" className="offer section-pad">
      <div className="offer__word" aria-hidden="true">EVOLUA+</div>
      <div className="offer__glow" aria-hidden="true" />
      <div className="page-shell">
        <SectionHeading
          eyebrow="SUA DECISÃO, SEU PRÓXIMO PASSO"
          title={<>Seu próximo passo começa<br className="desktop-only" /> com uma <em>decisão.</em></>}
          align="center"
        />
        <div className="offer__grid">
          <Reveal className="offer-card-wrap" amount={0.08}>
            <article className="offer-card">
              <div className="offer-card__top">
                <span>OFERTA COMPLETA</span>
                <span>EVOLUA+</span>
              </div>
              <h3>EVOLUA+<br /><em>COMPLETO</em></h3>
              <ul>
                <li><Check size={18} />Pack Desenvolvimento Pessoal</li>
                <li><Check size={18} />Pack Coaching</li>
                <li><Check size={18} />Bônus: Grupo Evolua+</li>
              </ul>
              <div className="offer-card__price">
                <span>VALOR DA OFERTA</span>
                <data value="57.90"><small>R$</small> 57,90</data>
                <p>Pagamento único.</p>
              </div>
              <BuyButton className="offer-card__buy">COMPRAR PELO WHATSAPP</BuyButton>
              <p className="offer-card__note">Atendimento e confirmação da compra pelo WhatsApp. Este site não possui checkout.</p>
              <div className="offer-card__assurances" aria-label="Facilidades da compra">
                <span><Check size={12} />Sem cadastro</span>
                <span><Check size={12} />Atendimento direto</span>
                <span><Check size={12} />Dúvidas antes de pagar</span>
              </div>
            </article>
          </Reveal>

          <div className="purchase-guide">
            <Reveal><span className="purchase-guide__eyebrow">COMO COMPRAR</span><h3>Do clique<br />à conversa.</h3></Reveal>
            <ol>
              {purchaseSteps.map((step, index) => (
                <Reveal key={step.number} delay={0.08 + index * 0.08} amount={0.2}>
                  <li>
                    <span>{step.number}</span>
                    <div><h4>{step.title}</h4><p>{step.description}</p></div>
                  </li>
                </Reveal>
              ))}
            </ol>
            <Reveal><a href="#faq" className="text-link">Consultar perguntas frequentes <ArrowUpRight size={16} /></a></Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <section id="faq" className="faq section-pad">
      <div className="page-shell faq__grid">
        <div className="faq__intro">
          <SectionHeading
            eyebrow="PERGUNTAS FREQUENTES"
            title={<>Antes de decidir,<br />vale <em>saber.</em></>}
            description="Informações diretas sobre a oferta, os materiais e o atendimento pelo WhatsApp."
          />
          <Reveal delay={0.12} className="faq__contact">
            <span>Ainda tem uma dúvida?</span>
            <p>Fale com o atendimento e confirme as condições antes de comprar.</p>
            <BuyButton variant="outline" compact>FALAR PELO WHATSAPP</BuyButton>
          </Reveal>
        </div>
        <Reveal className="faq__list" delay={0.08} amount={0.05}>
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div className={`faq-item ${isOpen ? "is-open" : ""}`} key={faq.question}>
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${index}`}
                    id={`faq-question-${index}`}
                  >
                    <span className="faq-item__number">0{index + 1}</span>
                    <span>{faq.question}</span>
                    <motion.i animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}><ChevronDown size={19} /></motion.i>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${index}`}
                      role="region"
                      aria-labelledby={`faq-question-${index}`}
                      className="faq-item__answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ height: { duration: 0.4, ease }, opacity: { duration: 0.25 } }}
                    >
                      <p>{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}

function MobilePurchaseBar() {
  const [visible, setVisible] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      const threshold = Math.max(420, window.innerHeight * 0.68);
      setVisible(window.scrollY > threshold);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          className="mobile-purchase-bar"
          aria-label="Compra rápida Evolua+"
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 110 }}
          animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 110 }}
          transition={{ duration: reducedMotion ? 0.2 : 0.45, ease }}
        >
          <div className="mobile-purchase-bar__price">
            <data value="57.90">R$ 57,90</data>
            <span>Pagamento único</span>
          </div>
          <motion.a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            whileTap={{ scale: 0.98 }}
            aria-label="Comprar Evolua+ por R$ 57,90 pelo WhatsApp — abrir em nova aba"
          >
            <MessageCircle size={17} aria-hidden="true" />
            <span>COMPRAR AGORA</span>
            <ArrowUpRight size={16} aria-hidden="true" />
          </motion.a>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

function Footer({ onOpenLegal }: { onOpenLegal: (type: LegalType) => void }) {
  return (
    <footer className="footer">
      <div className="footer__glow" aria-hidden="true" />
      <div className="page-shell">
        <div className="footer__main">
          <div className="footer__brand">
            <Logo />
            <p>Materiais digitais de desenvolvimento pessoal e coaching, com uma comunidade de membros como bônus.</p>
            <span>APRENDA. EVOLUA. CONQUISTE.</span>
          </div>
          <div className="footer__column">
            <h2>Navegação</h2>
            {navItems.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
            <a href="#oferta">Oferta completa</a>
          </div>
          <div className="footer__column">
            <h2>Informações</h2>
            <button type="button" onClick={() => onOpenLegal("termos")}>Termos de uso</button>
            <button type="button" onClick={() => onOpenLegal("privacidade")}>Política de privacidade</button>
            <a href="#receba">Conteúdos da oferta</a>
          </div>
          <div className="footer__contact">
            <h2>Vamos conversar?</h2>
            <p>Inicie o atendimento e confirme todos os detalhes da sua compra.</p>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
              <MessageCircle size={19} />WhatsApp<ArrowUpRight size={18} />
            </a>
          </div>
        </div>
        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} EVOLUA+. TODOS OS DIREITOS RESERVADOS.</span>
          <a href="#inicio">VOLTAR AO TOPO <ArrowUpRight size={14} /></a>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const [activePack, setActivePack] = useState<PackType>("desenvolvimento");
  const [legalType, setLegalType] = useState<LegalType | null>(null);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 28, restDelta: 0.001 });
  const closeLegal = useCallback(() => setLegalType(null), []);

  return (
    <>
      <a className="skip-link" href="#main-content">Pular para o conteúdo</a>
      <motion.div className="page-progress" style={{ scaleX: progress }} aria-hidden="true" />
      <div className="site-noise" aria-hidden="true" />
      <Header />
      <main id="main-content">
        <Hero />
        <ConceptSection onSelectPack={setActivePack} />
        <StoryScroll />
        <ReceiveSection activePack={activePack} setActivePack={setActivePack} />
        <BonusSection />
        <BenefitsSection />
        <OfferSection />
        <FaqSection />
      </main>
      <Footer onOpenLegal={setLegalType} />
      <MobilePurchaseBar />
      <LegalDialog type={legalType} onClose={closeLegal} />
    </>
  );
}
