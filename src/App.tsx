import { useEffect, useMemo, useState, type FormEvent } from 'react';
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

  const goToWhatsApp = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const lines = cartProducts.map(({ product, quantity }) => `• ${product.name} × ${quantity}`).join('\n');
    const message = `Bonjour GN Store, je souhaite confirmer cette commande :\n${lines}\n\nNom : ${data.get('name')}\nTéléphone : ${data.get('phone')}\nCommune / ville : ${data.get('city')}\n\nMerci de me confirmer la disponibilité, les prix et les modalités de livraison.`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  return <div className="site-shell">
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
      <section className="hero" id="accueil">
        <div className="hero-image"><img src={asset('/gallery/10.jpeg')} alt="Façade et entrée de la boutique GN Store à Abidjan"/><span className="image-caption">La maison GN Store · Abidjan</span></div>
        <div className="hero-copy"><p className="eyebrow">L’art du détail, au quotidien</p><h1>Le style<br/><em>vous ressemble.</em></h1><p>Vêtements, chaussures et accessoires choisis pour affirmer votre allure. Découvrez notre univers et demandez les disponibilités directement à la boutique.</p><a href="#boutique" className="button button-dark">Explorer la boutique <span>↗</span></a><div className="hero-signature"><span>01 —</span> L’élégance en mouvement</div></div>
        <div className="hero-index">GN / 2026</div>
      </section>

      <section className="intro-strip"><span>01 / SÉLECTION</span><p>Une adresse de style, une sélection pour toutes les envies.</p><span>ABIDJAN · CI</span></section>

      <section className="shop-section" id="boutique">
        <div className="section-top"><div><p className="eyebrow">La sélection GN</p><h2>À chacun son <em>essentiel.</em></h2></div><p className="section-note">Les pièces et tarifs varient selon les arrivages. Écrivez-nous pour confirmer le modèle et sa disponibilité.</p></div>
        <div className="catalog-controls"><label className="search-box"><span aria-hidden="true">⌕</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher un article" aria-label="Rechercher un article"/></label><label className="sort-control"><span>Trier</span><select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Trier les articles"><option value="featured">À la une</option><option value="name">Nom A–Z</option></select></label></div>
        <div className="category-tabs" role="group" aria-label="Filtrer par catégorie">{categories.map((item) => <button key={item} type="button" className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>{item}</button>)}</div>
        <div className="product-grid">{filteredProducts.map((product, index) => <article className="product-card" key={product.id}>
          <button className="product-photo" type="button" onClick={() => setSelected(product)} aria-label={`Voir ${product.name}`}><img src={asset(product.image)} alt={product.name} loading={index > 2 ? 'lazy' : 'eager'}/><span className="photo-number">0{index + 1}</span><span className="quick-view">Voir l’article ↗</span></button>
          <div className="product-info"><div><span className="product-category">{product.category}</span><h3>{product.name}</h3></div><button type="button" className="add-button" onClick={() => addToCart(product)} aria-label={`Ajouter ${product.name} au panier`}>＋</button></div>
          <p className="price-note">Prix & disponibilité sur demande</p>
        </article>)}</div>
        {filteredProducts.length === 0 && category === 'Chaussures' && !query.trim() ? <div className="empty-state"><p>Les chaussures sont proposées en boutique. Demandez-nous les modèles et pointures actuellement disponibles.</p><a className="button button-dark" href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Bonjour GN Store, quels modèles de chaussures et quelles pointures sont actuellement disponibles ?')}`} target="_blank" rel="noreferrer">Demander les modèles sur WhatsApp <span>↗</span></a></div> : filteredProducts.length === 0 && <p className="empty-state">Aucun article ne correspond à cette recherche. Essayez une autre catégorie ou contactez la boutique.</p>}
        <p className="catalog-footnote">Notre catalogue évolue avec les arrivages. Le montant final est confirmé par la boutique avant validation.</p>
      </section>

      <section className="editorial" id="histoire"><div className="editorial-image"><img src={asset('/gallery/11.jpeg')} alt="Intérieur de la boutique GN Store" loading="lazy"/><span>Une boutique, mille façons d’être soi.</span></div><div className="editorial-copy"><p className="eyebrow">Notre maison · Depuis Abidjan</p><h2>La personnalité<br/>est dans le <em>détail.</em></h2><p>GN Store rassemble vêtements, chaussures, chapeaux, casquettes et bijoux dans une même adresse. Une sélection vivante, faite pour accompagner votre style au quotidien.</p><a href="#contact" className="text-link">Nous rendre visite <span>↗</span></a><div className="editorial-mark">GN<span>®</span></div></div></section>

      <section className="visit-section"><div><p className="eyebrow">À votre écoute</p><h2>Un modèle vous plaît ?</h2><p>Envoyez-nous une photo ou une description. Nous vous répondrons sur les tailles, la disponibilité et le prix.</p></div><a className="button button-light" href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Bonjour GN Store, je souhaite des renseignements sur un article.')}`} target="_blank" rel="noreferrer">Écrire sur WhatsApp <span>↗</span></a></section>
    </main>

    <footer className="footer" id="contact"><div className="footer-brand"><img src={logo} alt="Logo officiel GN Store"/><div><strong>GN <b>store</b></strong><span>ARTISAN DU STYLE</span></div></div><div className="footer-address"><span>RETROUVEZ-NOUS</span><p>Abidjan, Côte d’Ivoire</p><small>Adresse précise à confirmer auprès de la boutique.</small></div><div className="footer-contact"><span>CONTACT & COMMANDES</span><a href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Bonjour GN Store, je souhaite des renseignements.')}`} target="_blank" rel="noreferrer" aria-label="Contacter GN Store sur WhatsApp au +225 07 08 02 83 03">+225 07 08 02 83 03 · WhatsApp ↗</a></div><div className="footer-bottom"><span>© 2026 GN Store · By Fabian</span><a href="#accueil">Retour en haut ↑</a></div></footer>

    {selected && <div className="overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}><section className="detail-panel" role="dialog" aria-modal="true" aria-labelledby="detail-title"><button className="close-button" onClick={() => setSelected(null)} aria-label="Fermer">×</button><img src={asset(selected.image)} alt={selected.name}/><div className="detail-copy"><span className="product-category">{selected.category}</span><h2 id="detail-title">{selected.name}</h2><p>{selected.description}</p><strong>Prix et disponibilité sur demande</strong><button className="button button-dark" onClick={() => { addToCart(selected); setSelected(null); setCartOpen(true); }}>Ajouter au panier <span>＋</span></button></div></section></div>}

    {cartOpen && <div className="overlay cart-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setCartOpen(false); }}><aside className="cart-panel" role="dialog" aria-modal="true" aria-labelledby="cart-title"><div className="cart-heading"><h2 id="cart-title">Votre panier <span>({cartCount})</span></h2><button className="close-button" onClick={() => setCartOpen(false)} aria-label="Fermer le panier">×</button></div>{cartProducts.length ? <><div className="cart-items">{cartProducts.map(({ product, quantity }) => <div className="cart-item" key={product.id}><img src={asset(product.image)} alt=""/><div><strong>{product.name}</strong><span>{product.category}</span><div className="quantity-control"><button onClick={() => updateQuantity(product.id, -1)} aria-label="Retirer une unité">−</button><span>{quantity}</span><button onClick={() => updateQuantity(product.id, 1)} aria-label="Ajouter une unité">＋</button><button className="remove-line" onClick={() => setCart((current) => current.filter((item) => item.productId !== product.id))}>Supprimer</button></div></div></div>)}</div><p className="cart-total"><span>Total provisoire</span><strong>À confirmer</strong></p><p className="cart-hint">Ce panier prépare un message WhatsApp. La boutique confirmera les prix, les disponibilités et la livraison avant validation.</p><form className="checkout-form" onSubmit={goToWhatsApp}><h3>Préparer ma demande</h3><label>Votre nom<input name="name" autoComplete="name" required placeholder="Nom et prénom"/></label><label>Téléphone<input name="phone" type="tel" autoComplete="tel" required placeholder="Numéro joignable"/></label><label>Commune / ville<input name="city" autoComplete="address-level2" required placeholder="Ex. Cocody, Abidjan"/></label><button className="button button-dark" type="submit">Envoyer ma demande sur WhatsApp <span>↗</span></button></form></> : <div className="cart-empty"><p>Votre panier est encore vide.</p><button className="button button-dark" onClick={() => setCartOpen(false)}>Découvrir la sélection <span>↗</span></button></div>}</aside></div>}
  </div>;
}

export default App;
