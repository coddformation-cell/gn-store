import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import BlurText from './components/ReactBits/BlurText';
import './App.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const categories = [
  {
    title: 'Bijoux',
    subtitle: 'Chaînes et pendentifs premium',
    image: '/gallery/10.jpeg',
    accent: 'Acier inoxydable'
  },
  {
    title: 'Cuir',
    subtitle: 'Accessoires de style urbain',
    image: '/gallery/7.jpeg',
    accent: 'Luxe quotidien'
  },
  {
    title: 'Lifestyle',
    subtitle: 'Équipements & accessoires',
    image: '/gallery/8.jpeg',
    accent: 'Édition limitée'
  }
];

const bestSellers = [
  { name: 'Chaîne premium', price: '18 000 FCFA', image: '/gallery/3.jpeg', tag: 'Best seller' },
  { name: 'Casquette signature', price: '12 000 FCFA', image: '/gallery/5.jpeg', tag: 'New' },
  { name: 'Parure en acier', price: '24 000 FCFA', image: '/gallery/9.jpeg', tag: 'Top pick' },
  { name: 'Accessoire lifestyle', price: '15 000 FCFA', image: '/gallery/4.jpeg', tag: 'Popular' }
];

const gallery = ['/gallery/2.jpeg', '/gallery/11.jpeg', '/gallery/12.jpeg'];

function App() {
  const scope = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
    };
  }, []);

  useGSAP(
    () => {
      gsap.from('.reveal', {
        opacity: 0,
        y: 40,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.showcase',
          start: 'top 75%'
        }
      });

      gsap.from('.floating-card', {
        opacity: 0,
        x: 50,
        duration: 1.2,
        delay: 0.3,
        ease: 'power3.out'
      });
    },
    { scope }
  );

  return (
    <div ref={scope} className="app-shell">
      <header className="topbar reveal">
        <div className="brand" aria-label="GN store brand">
          <div className="brand-mark">GN</div>
          <div className="brand-text">
            <span>GN</span>
            <strong>store</strong>
          </div>
        </div>

        <nav className="main-nav" aria-label="Navigation principale">
          <a href="#collection">Collection</a>
          <a href="#best-sellers">Best sellers</a>
          <a href="#boutique">Boutique</a>
          <a href="#contact">Contact</a>
        </nav>

        <a
          className="primary-btn"
          href="https://wa.me/2250708028303"
          target="_blank"
          rel="noreferrer"
        >
          Commander
        </a>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-copy reveal">
            <p className="eyebrow">Bijoux • Cuir • Lifestyle</p>
            <BlurText
              text="GN store"
              delay={60}
              animateBy="words"
              direction="top"
              className="hero-title"
            />
            <p className="hero-subtitle">
              Une sélection premium pensée pour les hommes et femmes qui veulent une image forte,
              élégante et authentique.
            </p>

            <div className="action-row">
              <a className="primary-btn" href="#collection">Découvrir la collection</a>
              <a className="secondary-btn" href="https://wa.me/2250708028303" target="_blank" rel="noreferrer">
                WhatsApp
              </a>
            </div>

            <ul className="hero-stats" aria-label="Statistiques de la boutique">
              <li>
                <strong>+500</strong>
                <span>articles vendus</span>
              </li>
              <li>
                <strong>4.9/5</strong>
                <span>avis clients</span>
              </li>
              <li>
                <strong>24h</strong>
                <span>réponse rapide</span>
              </li>
            </ul>
          </div>

          <div className="hero-visual reveal">
            <img src="/gallery/WhatsApp Image 2026-11-15 at 00.12.45.jpeg" alt="Façade de la boutique GN Store" />
            <div className="floating-card">
              <span className="card-tag">Collection</span>
              <strong>Signature premium</strong>
              <small>Bijoux, cuir et lifestyle.</small>
            </div>
          </div>
        </section>

        <section className="showcase" id="collection">
          <div className="section-heading reveal">
            <p className="eyebrow">Notre univers</p>
            <h2>Des pièces qui marquent le style.</h2>
          </div>

          <div className="category-grid">
            {categories.map((category) => (
              <article className="category-card reveal" key={category.title}>
                <img src={category.image} alt={category.title} />
                <div className="category-body">
                  <span>{category.accent}</span>
                  <h3>{category.title}</h3>
                  <p>{category.subtitle}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="feature-band reveal">
          <div>
            <p className="eyebrow">Habillage premium</p>
            <h2>Une boutique pensée pour le luxe discret et la présence.</h2>
          </div>
          <div className="feature-pills" aria-label="Points forts">
            <span>Acier inoxydable</span>
            <span>Modèles tendances</span>
            <span>Livraison rapide</span>
          </div>
        </section>

        <section className="products" id="best-sellers">
          <div className="section-heading reveal">
            <p className="eyebrow">Best sellers</p>
            <h2>Les pièces les plus demandées.</h2>
          </div>

          <div className="product-grid">
            {bestSellers.map((product) => (
              <article className="product-card reveal" key={product.name}>
                <div className="product-image-wrap">
                  <img src={product.image} alt={product.name} />
                  <span className="product-tag">{product.tag}</span>
                </div>
                <div className="product-meta">
                  <h3>{product.name}</h3>
                  <div className="product-row">
                    <strong>{product.price}</strong>
                    <a href="https://wa.me/2250708028303" target="_blank" rel="noreferrer">
                      Commander
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="story-section" id="boutique">
          <div className="story-copy reveal">
            <p className="eyebrow">Boutique</p>
            <h2>Un univers visuel premium inspiré de la rue et du luxe.</h2>
            <p>
              GN Store mélange le caractère fort du style urbain et la finesse des matières premium.
              Chaque pièce est sélectionnée pour transmettre un signal de confiance, d’élégance et de
              présence.
            </p>
          </div>

          <div className="story-gallery reveal">
            {gallery.map((image, index) => (
              <div className={`story-frame frame-${index + 1}`} key={image}>
                <img src={image} alt={`Vue boutique GN Store ${index + 1}`} />
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer reveal" id="contact">
        <div className="footer-brand">
          <div className="brand-mark">GN</div>
          <div>
            <strong>GN store</strong>
            <span>Bijoux • Cuir • Lifestyle</span>
          </div>
        </div>

        <div className="footer-contact">
          <a href="tel:+2250708028303">+225 07 08 02 83 03</a>
          <a href="https://wa.me/2250708028303" target="_blank" rel="noreferrer">
            Commander sur WhatsApp
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
