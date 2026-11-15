import { useEffect, useMemo, useState, type FormEvent, type PointerEvent as ReactPointerEvent } from 'react';
import './App.css';

const whatsappNumber = '2250708028303';
const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
const logo = asset('gallery/WhatsApp Image 2026-11-15 at 00.12.45.jpeg');

type Product = { id: string; name: string; category: string; image: string; description: string };
type CartLine = { productId: string; quantity: number };

const products: Product[] = [
  { id: 'chaines', name: 'Chaînes & pendentifs', category: 'Bijoux', image: '/gallery/2.jpeg', description: 'Une sélection de chaînes et pendentifs présentée en boutique. Modèles, matière et disponibilité à confirmer.' },
  { id: 'parures', name: 'Colliers', category: 'Bijoux', image: '/gallery/3.jpeg', description: 'Différents colliers exposés en boutique. Écrivez-nous pour confirmer le modèle et sa disponibilité.' },
  { id: 'bracelets', name: 'Bracelets', category: 'Bijoux', image: '/gallery/4.jpeg', description: 'Bracelets présentés en boutique. Écrivez-nous pour confirmer le modèle et sa disponibilité.' },
  { id: 'bagues', name: 'Bagues', category: 'Bijoux', image: '/gallery/5.jpeg', description: 'Une sélection de bagues exposées en boutique. Envoyez-nous une photo ou décrivez le modèle recherché.' },
  { id: 'chapeau', name: 'Chapeau de ville', category: 'Chapeaux & casquettes', image: '/gallery/6.jpeg', description: 'Chapeau présenté avec une tenue de la boutique. Taille et disponibilité à confirmer.' },
  { id: 'casquettes', name: 'Casquettes', category: 'Chapeaux & casquettes', image: '/gallery/7.jpeg', description: 'Différents modèles de casquettes visibles en boutique. Modèles et couleurs selon disponibilité.' },
  { id: 'vetements', name: 'Tenue habillée', category: 'Vêtements', image: '/gallery/9.jpeg', description: 'Tenue habillée présentée sur mannequin. Articles, tailles et disponibilité à confirmer auprès de la boutique.' },
  { id: 'accessoires', name: 'Accessoires & lunettes', category: 'Accessoires', image: '/gallery/8.jpeg', description: 'Une sélection d’accessoires photographiée en boutique. Écrivez-nous pour confirmer le modèle.' },
];

const categories = ['Tout voir', 'Vêtements', 'Chaussures', 'Chapeaux & casquettes', 'Bijoux', 'Accessoires'];
function App() {
  const [loaderState, setLoaderState] = useState<'loading' | 'leaving' | 'done'>('loading');
  const [cart, setCart] = useState<CartLine[]>(() => {
    try { return JSON.parse(localStorage.getItem('gn-store-cart') ?? '[]') as CartLine[]; }
    catch { return []; }
  });
  const [category, setCategory] = useState('Tout voir');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('featured');
  const [selected, setSelected] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => { localStorage.setItem('gn-store-cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setLoaderState('done');
      return;
    }

    const startedAt = performance.now();
    let exitTimer = 0;
    let removeTimer = 0;
    let fallbackTimer = 0;
    let finished = false;
    const finishLoading = () => {
      if (finished) return;
      finished = true;
      window.clearTimeout(fallbackTimer);
      window.removeEventListener('load', finishLoading);
      const remainingMinimum = Math.max(0, 1450 - (performance.now() - startedAt));
      exitTimer = window.setTimeout(() => {
        setLoaderState('leaving');
        removeTimer = window.setTimeout(() => setLoaderState('done'), 720);
      }, remainingMinimum);
    };

    fallbackTimer = window.setTimeout(finishLoading, 2600);
    if (document.readyState === 'complete') finishLoading();
    else window.addEventListener('load', finishLoading, { once: true });
    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(removeTimer);
      window.clearTimeout(fallbackTimer);
      window.removeEventListener('load', finishLoading);
    };
  }, []);
  useEffect(() => {
    const shell = document.querySelector('.site-shell');
    const revealItems = shell?.querySelectorAll<HTMLElement>('[data-motion-reveal]');
    if (!shell || !revealItems?.length) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion || !('IntersectionObserver' in window)) {
      revealItems.forEach((item) => item.classList.add('is-visible'));
      return;
    }

    shell.classList.add('motion-enhanced');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    revealItems.forEach((item) => observer.observe(item));
    return () => {
      observer.disconnect();
      shell.classList.remove('motion-enhanced');
    };
  }, [category, query, sort]);
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>('.hero');
    const photo = hero?.querySelector<HTMLElement>('.hero-image img');
    const sphere = hero;
    if (!hero || !photo || !sphere || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    const updateDepth = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const bounds = hero.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, (window.innerHeight - bounds.top) / (window.innerHeight + bounds.height)));
        photo.style.setProperty('--photo-drift', `${progress * -34}px`);
        sphere.style.setProperty('--sphere-drift', `${progress * 62}px`);
      });
    };

    updateDepth();
    window.addEventListener('scroll', updateDepth, { passive: true });
    window.addEventListener('resize', updateDepth);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', updateDepth);
      window.removeEventListener('resize', updateDepth);
    };
  }, []);
  useEffect(() => {
    const orb = document.querySelector<HTMLElement>('.scroll-orb');
    if (!orb || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    const updateOrb = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        const progress = Math.max(0, Math.min(1, window.scrollY / maxScroll));
        const startY = window.innerWidth <= 600 ? 104 : 124;
        const descent = startY + progress * window.innerHeight * 0.9;
        const drift = Math.sin(progress * Math.PI) * Math.min(25, window.innerWidth * 0.04);
        const scale = 0.86 + Math.sin(progress * Math.PI) * 0.14;
        orb.style.setProperty('--orb-y', `${descent}px`);
        orb.style.setProperty('--orb-x', `${drift}px`);
        orb.style.setProperty('--orb-scale', String(scale));
        orb.style.setProperty('--orb-opacity', String(0.62 * Math.min(1, (1 - progress) * 5)));
      });
    };

    updateOrb();
    window.addEventListener('scroll', updateOrb, { passive: true });
    window.addEventListener('resize', updateOrb);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', updateOrb);
      window.removeEventListener('resize', updateOrb);
    };
  }, []);
  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') { setSelected(null); setCartOpen(false); setMenuOpen(false); } };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, []);

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const categoryMatch = category === 'Tout voir' || product.category === category;
      const textMatch = `${product.name} ${product.category}`.toLocaleLowerCase('fr').includes(query.toLocaleLowerCase('fr'));
      return categoryMatch && textMatch;
    });
    return sort === 'name' ? [...filtered].sort((a, b) => a.name.localeCompare(b.name, 'fr')) : filtered;
  }, [category, query, sort]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const addToCart = (product: Product) => setCart((current) => {
    const line = current.find((item) => item.productId === product.id);
    return line ? current.map((item) => item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item) : [...current, { productId: product.id, quantity: 1 }];
  });
  const updateQuantity = (productId: string, amount: number) => setCart((current) => current.map((item) => item.productId === productId ? { ...item, quantity: item.quantity + amount } : item).filter((item) => item.quantity > 0));
  const cartProducts = cart.map((line) => ({ ...line, product: products.find((product) => product.id === line.productId)! })).filter((line) => line.product);
  const moveTilt = (event: ReactPointerEvent<HTMLElement>, selector: string, rangeX: number, rangeY: number) => {
    if (event.pointerType !== 'mouse') return;
    const target = event.currentTarget.querySelector<HTMLElement>(selector);
    if (!target) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    target.style.setProperty('--tilt-x', `${-y * rangeX}deg`);
    target.style.setProperty('--tilt-y', `${x * rangeY}deg`);
  };
  const resetTilt = (event: ReactPointerEvent<HTMLElement>, selector: string) => {
    const target = event.currentTarget.querySelector<HTMLElement>(selector);
    target?.style.removeProperty('--tilt-x');
    target?.style.removeProperty('--tilt-y');
  };

  const goToWhatsApp = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const lines = cartProducts.map(({ product, quantity }) => `• ${product.name} × ${quantity}`).join('\n');
    const message = `Bonjour GN Store, je souhaite confirmer cette commande :\n${lines}\n\nNom : ${data.get('name')}\nTéléphone : ${data.get('phone')}\nCommune / ville : ${data.get('city')}\n\nMerci de me confirmer la disponibilité, les prix et les modalités de livraison.`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  return <div className="site-shell">
    {loaderState !== 'done' && <div className={`site-loader${loaderState === 'leaving' ? ' is-leaving' : ''}`} role="status" aria-live="polite" aria-label="Chargement de GN Store"><div className="loader-content"><div className="loader-orb" aria-hidden="true"/><p>GN <em>store</em></p><span>ARTISAN DU STYLE · ABIDJAN</span><div className="loader-track"><i/></div><small>PRÉPARATION DE LA SÉLECTION</small></div></div>}
    <div className="scroll-orb" aria-hidden="true"/>
    <div className="announcement">GN Store · Artisan du style <span>Abidjan, Côte d’Ivoire</span></div>
    <header className="site-header">
      <a href="#accueil" className="brand" aria-label="GN Store, accueil"><img src={logo} alt="Logo officiel GN Store — By Fabian"/><span className="brand-name">GN <b>store</b><small>ARTISAN DU STYLE</small></span></a>
      <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? 'Fermer' : 'Menu'} <span>☰</span></button>
      <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Navigation principale" onClick={() => setMenuOpen(false)}>
        <a href="#accueil">Accueil</a><a href="#boutique">Boutique</a><a href="#histoire">Notre maison</a><a href="#contact">Contact</a>
      </nav>
      <button className="cart-button" type="button" onClick={() => setCartOpen(true)}>Panier <span>{cartCount}</span></button>
    </header>

    <main>
      <section className="hero" id="accueil" onPointerMove={(event) => moveTilt(event, '.hero-image', 4, 7)} onPointerLeave={(event) => resetTilt(event, '.hero-image')}>
        <div className="hero-image"><img src={asset('/gallery/10.jpeg')} alt="Façade et entrée de la boutique GN Store à Abidjan"/><span className="image-caption">La maison GN Store · Abidjan</span></div>
        <div className="hero-copy"><p className="eyebrow">L’art du détail, au quotidien</p><h1>Le style<br/><em>vous ressemble.</em></h1><p>Vêtements, chaussures et accessoires choisis pour affirmer votre allure. Découvrez notre univers et demandez les disponibilités directement à la boutique.</p><a href="#boutique" className="button button-light">Explorer la boutique <span>↗</span></a><div className="hero-signature"><span>01 —</span> L’élégance en mouvement</div></div>
        <div className="hero-index">GN / 2026</div>
      </section>

      <section className="intro-strip" data-motion-reveal><span>01 / SÉLECTION</span><p>Une adresse de style, une sélection pour toutes les envies.</p><span>ABIDJAN · CI</span></section>

      <section className="shop-section" id="boutique">
        <div className="section-top" data-motion-reveal><div><p className="eyebrow">La sélection GN</p><h2>À chacun son <em>essentiel.</em></h2></div><p className="section-note">Les pièces et tarifs varient selon les arrivages. Écrivez-nous pour confirmer le modèle et sa disponibilité.</p></div>
        <div className="catalog-controls" data-motion-reveal><label className="search-box"><span aria-hidden="true">⌕</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher un article" aria-label="Rechercher un article"/></label><label className="sort-control"><span>Trier</span><select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Trier les articles"><option value="featured">À la une</option><option value="name">Nom A–Z</option></select></label></div>
        <div className="category-tabs" role="group" aria-label="Filtrer par catégorie" data-motion-reveal>{categories.map((item) => <button key={item} type="button" className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>{item}</button>)}</div>
        <div className="product-grid">{filteredProducts.map((product, index) => <article className="product-card" data-motion-reveal key={product.id} style={{ transitionDelay: `${Math.min(index, 5) * 75}ms` }} onPointerMove={(event) => moveTilt(event, '.product-photo', 5, 7)} onPointerLeave={(event) => resetTilt(event, '.product-photo')}>
          <button className="product-photo" type="button" onClick={() => setSelected(product)} aria-label={`Voir ${product.name}`}><img src={asset(product.image)} alt={product.name} loading={index > 2 ? 'lazy' : 'eager'}/><span className="photo-number">0{index + 1}</span><span className="quick-view">Voir l’article ↗</span></button>
          <div className="product-info"><div><span className="product-category">{product.category}</span><h3>{product.name}</h3></div><button type="button" className="add-button" onClick={() => addToCart(product)} aria-label={`Ajouter ${product.name} au panier`}>＋</button></div>
          <p className="price-note">Prix & disponibilité sur demande</p>
        </article>)}</div>
        {filteredProducts.length === 0 && category === 'Chaussures' && !query.trim() ? <div className="empty-state"><p>Les chaussures sont proposées en boutique. Demandez-nous les modèles et pointures actuellement disponibles.</p><a className="button button-dark" href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Bonjour GN Store, quels modèles de chaussures et quelles pointures sont actuellement disponibles ?')}`} target="_blank" rel="noreferrer">Demander les modèles sur WhatsApp <span>↗</span></a></div> : filteredProducts.length === 0 && <p className="empty-state">Aucun article ne correspond à cette recherche. Essayez une autre catégorie ou contactez la boutique.</p>}
        <p className="catalog-footnote">Notre catalogue évolue avec les arrivages. Le montant final est confirmé par la boutique avant validation.</p>
      </section>

      <section className="editorial" id="histoire"><div className="editorial-image" data-motion-reveal><img src={asset('/gallery/11.jpeg')} alt="Intérieur de la boutique GN Store" loading="lazy"/><span>Une boutique, mille façons d’être soi.</span></div><div className="editorial-copy" data-motion-reveal><p className="eyebrow">Notre maison · Depuis Abidjan</p><h2>La personnalité<br/>est dans le <em>détail.</em></h2><p>GN Store rassemble vêtements, chaussures, chapeaux, casquettes et bijoux dans une même adresse. Une sélection vivante, faite pour accompagner votre style au quotidien.</p><a href="#contact" className="text-link">Nous rendre visite <span>↗</span></a><div className="editorial-mark">GN<span>®</span></div></div></section>

      <section className="visit-section"><div data-motion-reveal><p className="eyebrow">À votre écoute</p><h2>Un modèle vous plaît ?</h2><p>Envoyez-nous une photo ou une description. Nous vous répondrons sur les tailles, la disponibilité et le prix.</p></div><a data-motion-reveal className="button button-light" href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Bonjour GN Store, je souhaite des renseignements sur un article.')}`} target="_blank" rel="noreferrer">Écrire sur WhatsApp <span>↗</span></a></section>
    </main>

    <footer className="footer" id="contact"><div className="footer-brand" data-motion-reveal><img src={logo} alt="Logo officiel GN Store"/><div><strong>GN <b>store</b></strong><span>ARTISAN DU STYLE</span></div></div><div className="footer-address" data-motion-reveal><span>RETROUVEZ-NOUS</span><p>Abidjan, Côte d’Ivoire</p><small>Adresse précise à confirmer auprès de la boutique.</small></div><div className="footer-contact" data-motion-reveal><span>CONTACT & COMMANDES</span><div className="footer-contact-line"><a className="whatsapp-icon" href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Bonjour GN Store, je souhaite des renseignements.')}`} target="_blank" rel="noreferrer" aria-label="Contacter GN Store sur WhatsApp" title="Contacter GN Store sur WhatsApp"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12.04 2a9.9 9.9 0 0 0-8.52 14.94L2 22l5.23-1.37A9.94 9.94 0 1 0 12.04 2Zm0 17.99a8.02 8.02 0 0 1-4.1-1.13l-.3-.18-3.1.81.83-3.02-.2-.31a8.06 8.06 0 1 1 6.87 3.83Zm4.42-6.04c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.41-.54-.42h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.09 3.62.57.25 1.02.4 1.37.51.57.18 1.08.16 1.49.1.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z"/></svg></a></div></div><div className="footer-bottom" data-motion-reveal><span>© 2026 GN Store · By Fabian</span><a href="#accueil">Retour en haut ↑</a></div></footer>

    {selected && <div className="overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}><section className="detail-panel" role="dialog" aria-modal="true" aria-labelledby="detail-title"><button className="close-button" onClick={() => setSelected(null)} aria-label="Fermer">×</button><img src={asset(selected.image)} alt={selected.name}/><div className="detail-copy"><span className="product-category">{selected.category}</span><h2 id="detail-title">{selected.name}</h2><p>{selected.description}</p><strong>Prix et disponibilité sur demande</strong><button className="button button-dark" onClick={() => { addToCart(selected); setSelected(null); setCartOpen(true); }}>Ajouter au panier <span>＋</span></button></div></section></div>}

    {cartOpen && <div className="overlay cart-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setCartOpen(false); }}><aside className="cart-panel" role="dialog" aria-modal="true" aria-labelledby="cart-title"><div className="cart-heading"><h2 id="cart-title">Votre panier <span>({cartCount})</span></h2><button className="close-button" onClick={() => setCartOpen(false)} aria-label="Fermer le panier">×</button></div>{cartProducts.length ? <><div className="cart-items">{cartProducts.map(({ product, quantity }) => <div className="cart-item" key={product.id}><img src={asset(product.image)} alt=""/><div><strong>{product.name}</strong><span>{product.category}</span><div className="quantity-control"><button onClick={() => updateQuantity(product.id, -1)} aria-label="Retirer une unité">−</button><span>{quantity}</span><button onClick={() => updateQuantity(product.id, 1)} aria-label="Ajouter une unité">＋</button><button className="remove-line" onClick={() => setCart((current) => current.filter((item) => item.productId !== product.id))}>Supprimer</button></div></div></div>)}</div><p className="cart-total"><span>Total provisoire</span><strong>À confirmer</strong></p><p className="cart-hint">Ce panier prépare un message WhatsApp. La boutique confirmera les prix, les disponibilités et la livraison avant validation.</p><form className="checkout-form" onSubmit={goToWhatsApp}><h3>Préparer ma demande</h3><label>Votre nom<input name="name" autoComplete="name" required placeholder="Nom et prénom"/></label><label>Téléphone<input name="phone" type="tel" autoComplete="tel" required placeholder="Numéro joignable"/></label><label>Commune / ville<input name="city" autoComplete="address-level2" required placeholder="Ex. Cocody, Abidjan"/></label><button className="button button-dark" type="submit">Envoyer ma demande sur WhatsApp <span>↗</span></button></form></> : <div className="cart-empty"><p>Votre panier est encore vide.</p><button className="button button-dark" onClick={() => setCartOpen(false)}>Découvrir la sélection <span>↗</span></button></div>}</aside></div>}
  </div>;
}

export default App;
