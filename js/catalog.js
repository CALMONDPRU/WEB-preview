(function () {
  const WHATSAPP = 'https://wa.me/447985651034';
  const PHONE_HREF = 'tel:01204792000';
  const PHONE_DISPLAY = '01204 792 000';

  const VAT_RATE = 1.2; // standard UK VAT — CSV sales prices are ex-VAT, site always displays inc-VAT

  function fmtPrice(p) {
    return p === null || p === undefined ? null : `£${(p * VAT_RATE).toFixed(2)}`;
  }

  // ---------- Fitting-card imagery ----------
  // No product photography exists in the repo yet, so every card gets a schematic line-icon
  // instead of a blank box: a handful of Guttering & Downpipe fitting families get a specific
  // icon (matched by keyword against the fitting-type name, same first-match-wins approach as
  // the CSV classification rules), everything else falls back to a generic placeholder glyph.
  const SVG_OPEN = 'viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"';
  const FITTING_ICONS = [
    [/OFFSET BEND/i, `<svg ${SVG_OPEN}><path d="M16 6v10l16 12v14"/></svg>`],
    [/ANGLE/i, `<svg ${SVG_OPEN}><path d="M12 40V22q0-8 8-8h16"/><circle cx="20" cy="14" r="2" fill="currentColor" stroke="none"/></svg>`],
    [/STOPEND/i, `<svg ${SVG_OPEN}><rect x="10" y="16" width="28" height="14" rx="4"/><line x1="10" y1="9" x2="10" y2="37" stroke-width="3.5"/></svg>`],
    [/UNION/i, `<svg ${SVG_OPEN}><line x1="5" y1="24" x2="17" y2="24"/><rect x="15" y="17" width="18" height="14" rx="2"/><line x1="31" y1="24" x2="43" y2="24"/></svg>`],
    [/CORNER/i, `<svg ${SVG_OPEN}><path d="M13 9v22q0 6 6 6h16"/></svg>`],
    [/ADAPT/i, `<svg ${SVG_OPEN}><path d="M5 27h10l5-10h12l5 10h10"/></svg>`],
    [/SOCKET/i, `<svg ${SVG_OPEN}><line x1="6" y1="24" x2="21" y2="24"/><path d="M21 15h12q5 0 5 5v8q0 5-5 5H21"/></svg>`],
    [/SHOE/i, `<svg ${SVG_OPEN}><line x1="19" y1="5" x2="19" y2="27" stroke-width="5"/><path d="M19 27q0 11 13 11h10" stroke-width="5"/></svg>`],
    [/BRANCH/i, `<svg ${SVG_OPEN}><line x1="24" y1="5" x2="24" y2="21"/><line x1="24" y1="21" x2="11" y2="42"/><line x1="24" y1="21" x2="37" y2="42"/></svg>`],
    [/BRACKET/i, `<svg ${SVG_OPEN}><path d="M10 9v26h26"/><circle cx="10" cy="9" r="2.5" fill="currentColor" stroke="none"/><circle cx="36" cy="35" r="2.5" fill="currentColor" stroke="none"/></svg>`],
    [/OUTLET/i, `<svg ${SVG_OPEN}><line x1="6" y1="15" x2="42" y2="15" stroke-width="6"/><line x1="24" y1="15" x2="24" y2="40"/></svg>`],
    [/HOPPER/i, `<svg ${SVG_OPEN}><path d="M7 9h34l-12 16v16h-10V25z"/></svg>`],
    [/FINIAL/i, `<svg ${SVG_OPEN}><line x1="24" y1="41" x2="24" y2="21"/><circle cx="24" cy="14" r="7"/></svg>`],
    [/CLIP/i, `<svg ${SVG_OPEN}><line x1="24" y1="5" x2="24" y2="43" stroke-width="6"/><path d="M15 16h18"/><path d="M15 32h18"/></svg>`],
    [/BRUSH/i, `<svg ${SVG_OPEN}><line x1="5" y1="24" x2="43" y2="24" stroke-width="6"/><path d="M10 14v20M16 14v20M22 14v20M28 14v20M34 14v20"/></svg>`],
    // Broad fallbacks last: anything still mentioning gutter/downpipe by this point is a plain
    // length (e.g. "2M Length Gutter", "5.5M Downpipe") since the specific fitting names above
    // (adaptor, socket, shoe, branch, bracket, outlet, hopper, clip, brush) already matched first.
    [/GUTTER/i, `<svg ${SVG_OPEN}><line x1="5" y1="24" x2="43" y2="24" stroke-width="6"/></svg>`],
    [/DOWNPIPE/i, `<svg ${SVG_OPEN}><line x1="24" y1="5" x2="24" y2="43" stroke-width="6"/></svg>`],
  ];
  const PLACEHOLDER_ICON = `<svg ${SVG_OPEN} stroke-width="2"><rect x="6" y="8" width="36" height="32" rx="3"/><circle cx="17" cy="19" r="3.5"/><path d="M6 32l10-9 8 7 7-6 11 10"/></svg>`;

  // Swatch colours for every colour name used anywhere in the catalogue (rainwater's fixed 5,
  // roofline's 5, and cladding's embossed range). Approximations for on-screen dots only.
  const COLOUR_HEX = {
    Black: '#1a1a1a',
    White: '#ffffff',
    Brown: '#6b4226',
    'Anthracite Grey': '#383e42',
    Caramel: '#b06a35',
    'Light Oak': '#c49a5c',
    Rosewood: '#6e2f22',
    Cream: '#efe5c8',
    'Chartwell Green': '#a9c1a2',
    'Platinum Grey': '#a7abab',
    'Empire Blue': '#24426b',
    'Sky Blue': '#8db7dc',
  };

  // Photo placeholder for cards that don't have a product image yet — a framed "image coming
  // soon" box, so cards keep the same shape once real photos are dropped in.
  function imagePlaceholder() {
    return el('div', { class: 'fitting-card__media fitting-card__media--photo', role: 'img', 'aria-label': 'Product image coming soon' }, [
      el('span', { class: 'fitting-card__media-icon', html: PLACEHOLDER_ICON }, []),
      el('span', { class: 'fitting-card__media-label' }, [document.createTextNode('Image coming soon')]),
    ]);
  }

  // Where a product photo lives: assets/products/<SKU>.jpg, with any character that can't go in
  // a filename (e.g. the slashes in K/FB/IC/AG) swapped for a dash → K-FB-IC-AG.jpg.
  function productImagePath(sku) {
    return `assets/products/${sku.replace(/[^A-Za-z0-9._-]/g, '-')}.jpg`;
  }

  function colourDots(names) {
    const row = el('div', { class: 'fitting-card__colours', 'aria-label': `Available in ${names.join(', ')}` }, []);
    names.forEach((n) => row.appendChild(el('span', { class: 'fitting-card__colour-dot', title: n, style: `background:${COLOUR_HEX[n] || '#ccc'}` }, [])));
    row.appendChild(el('span', { class: 'fitting-card__colour-count' }, [
      document.createTextNode(`${names.length} colour${names.length === 1 ? '' : 's'}`),
    ]));
    return row;
  }

  function fittingIcon(categorySlug, fittingType) {
    if (categorySlug === 'guttering-downpipe') {
      const match = FITTING_ICONS.find(([re]) => re.test(fittingType));
      if (match) return match[1];
    }
    return PLACEHOLDER_ICON;
  }

  function fetchCatalog() {
    // Browsers block fetch() of local files when a page is opened straight off disk (file://),
    // so data/catalog.js (loaded as a plain <script> before this file) sets this global with the
    // same data and is used whenever present. The fetch() below only runs as a fallback (e.g. if
    // that script tag is ever removed) — swap it for a real API call if a backend replaces this.
    if (window.CATALOG_DATA) return Promise.resolve(window.CATALOG_DATA);
    return fetch('data/catalog.json').then((r) => {
      if (!r.ok) throw new Error('Failed to load catalog');
      return r.json();
    });
  }

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      Object.entries(attrs).forEach(([k, v]) => {
        if (k === 'class') node.className = v;
        else if (k === 'html') node.innerHTML = v;
        else node.setAttribute(k, v);
      });
    }
    (children || []).forEach((c) => node.appendChild(c));
    return node;
  }

  // ---------- products.html : category hub ----------
  function renderCategoryHub(catalog) {
    const grid = document.getElementById('categoryGrid');
    if (!grid) return;
    grid.innerHTML = '';
    catalog.categories.forEach((cat) => {
      const card = el('a', { class: 'category-card', href: `category.html?cat=${encodeURIComponent(cat.slug)}` }, [
        el('h3', {}, [document.createTextNode(cat.name)]),
        el('p', { class: 'category-card__meta' }, [
          document.createTextNode(`${cat.productCount} fitting type${cat.productCount === 1 ? '' : 's'} · ${cat.itemCount} stock lines`),
        ]),
        el('span', { class: 'category-card__cta' }, [document.createTextNode('Browse range →')]),
      ]);
      grid.appendChild(card);
    });
  }

  // ---------- category.html : profile grid (if the category has one) or fitting-type listing ----------
  function renderCategoryPage(catalog) {
    const grid = document.getElementById('fittingGrid');
    if (!grid) return;
    const params = new URLSearchParams(location.search);
    const slug = params.get('cat');
    const profileSlug = params.get('profile');
    const cat = catalog.categories.find((c) => c.slug === slug);

    const titleEl = document.getElementById('categoryTitle');
    const summaryEl = document.getElementById('categorySummary');
    const breadcrumb = document.getElementById('breadcrumb');

    if (!cat) {
      titleEl.textContent = 'Category not found';
      summaryEl.textContent = 'Please choose a category from the full product range.';
      grid.innerHTML = '';
      return;
    }

    breadcrumb.appendChild(document.createTextNode(' / '));

    // Category has a profile branch and none is chosen yet: show the profile picker.
    if (cat.hasProfiles && !profileSlug) {
      document.title = `${cat.name} | WBPlastics`;
      titleEl.textContent = cat.name;
      summaryEl.textContent = `Choose a system below, then a fitting type, then your colour. ${cat.productCount} fitting types across ${cat.itemCount} stock lines.`;
      breadcrumb.appendChild(el('span', {}, [document.createTextNode(cat.name)]));

      grid.innerHTML = '';
      grid.classList.add('fitting-grid--profiles');
      cat.profiles.forEach((p) => {
        const card = el('a', { class: 'fitting-card', href: `category.html?cat=${encodeURIComponent(cat.slug)}&profile=${encodeURIComponent(p.slug)}` }, [
          el('h3', {}, [document.createTextNode(p.name)]),
          el('p', { class: 'fitting-card__meta' }, [
            document.createTextNode(`${p.productCount} fitting type${p.productCount === 1 ? '' : 's'} · ${p.itemCount} stock lines`),
          ]),
          el('span', { class: 'fitting-card__cta' }, [document.createTextNode('View fitting types →')]),
        ]);
        grid.appendChild(card);
      });
      return;
    }

    // Either the category has no profile branch, or a profile has been chosen: show fitting types.
    let fittingTypes = cat.fittingTypes;
    let profile = null;
    if (cat.hasProfiles) {
      profile = cat.profiles.find((p) => p.slug === profileSlug);
      if (!profile) {
        titleEl.textContent = 'System not found';
        summaryEl.textContent = 'Please choose a system from this category.';
        grid.innerHTML = '';
        return;
      }
      fittingTypes = profile.fittingTypes;
      breadcrumb.appendChild(el('a', { href: `category.html?cat=${encodeURIComponent(cat.slug)}` }, [document.createTextNode(cat.name)]));
      breadcrumb.appendChild(document.createTextNode(' / '));
      breadcrumb.appendChild(el('span', {}, [document.createTextNode(profile.name)]));
      document.title = `${profile.name} — ${cat.name} | WBPlastics`;
      titleEl.textContent = `${cat.name} — ${profile.name}`;
      summaryEl.textContent = `${profile.productCount} fitting type${profile.productCount === 1 ? '' : 's'} across ${profile.itemCount} stock lines. Every product below has a colour choice of Black, White, Brown, Anthracite Grey or Caramel.`;
    } else {
      breadcrumb.appendChild(el('span', {}, [document.createTextNode(cat.name)]));
      document.title = `${cat.name} | WBPlastics`;
      titleEl.textContent = cat.name;
      // Sheet-built categories (Roofline, Cladding) list the colours they actually offer.
      const colourList = cat.colourNames && cat.colourNames.length
        ? cat.colourNames.slice(0, -1).join(', ') + (cat.colourNames.length > 1 ? ' or ' : '') + cat.colourNames[cat.colourNames.length - 1]
        : null;
      summaryEl.textContent = colourList
        ? `${cat.productCount} products across ${cat.itemCount} stock lines. Choose ${cat.slug === 'roofline' ? 'a board size' : 'a product'}, then your colour — ${colourList}, where made.`
        : `${cat.productCount} fitting type${cat.productCount === 1 ? '' : 's'} across ${cat.itemCount} stock lines. Every product below has a colour choice of Black, White, Brown, Anthracite Grey or Caramel.`;
    }

    // Sectioned categories (Roofline): one heading + card grid per section, in the order the
    // build gives them (cards already sorted smallest board first).
    if (cat.sections) {
      grid.innerHTML = '';
      grid.className = 'fitting-sections';
      cat.sections.forEach((section) => {
        const sectionGrid = el('div', { class: 'fitting-grid' }, []);
        section.fittingTypes.forEach((f) => sectionGrid.appendChild(fittingCard(cat, f)));
        grid.appendChild(el('section', { class: 'fitting-section', id: slugAnchor(section.name) }, [
          el('h2', { class: 'fitting-section__title' }, [document.createTextNode(section.name)]),
          sectionGrid,
        ]));
      });
      // The cards are added after the page loads, so the browser's own jump to #section (from
      // a nav link like category.html?cat=roofline#flat-board) has already missed — do it now.
      // Instant, not smooth (the site sets scroll-behavior:smooth): a smooth scroll started while
      // the page is still loading gets cancelled. Repeated on 'load' in case images/fonts shift it.
      if (location.hash) {
        const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
        if (target) {
          const jump = () => target.scrollIntoView({ behavior: 'instant', block: 'start' });
          jump();
          if (document.readyState !== 'complete') window.addEventListener('load', jump, { once: true });
        }
      }
      return;
    }

    grid.innerHTML = '';
    const sorted = [...fittingTypes].sort((a, b) => a.fittingType.localeCompare(b.fittingType));
    sorted.forEach((f) => grid.appendChild(fittingCard(cat, f)));
  }

  function slugAnchor(s) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  function fittingCard(cat, f) {
    // Roofline cards carry maxPrice: show "£min – £max" when colours differ in price,
    // a single price when they don't (or there's only one colour).
    const minLabel = fmtPrice(f.representativePrice);
    const maxLabel = fmtPrice(f.maxPrice);
    const priceLabel = minLabel && maxLabel && maxLabel !== minLabel ? `${minLabel} – ${maxLabel}` : minLabel;
    const priceP = priceLabel
      ? el('p', { class: 'fitting-card__price' }, [
          el('strong', {}, [document.createTextNode(priceLabel)]),
          document.createTextNode(' '),
          el('span', { class: 'vat-note' }, [document.createTextNode('Inc VAT')]),
        ])
      : el('p', { class: 'fitting-card__price fitting-card__price--call' }, [document.createTextNode('Call for pricing')]);
    const media = f.colourNames
      ? imagePlaceholder()
      : el('div', { class: 'fitting-card__media', html: fittingIcon(cat.slug, f.fittingType) }, []);
    const children = [media, el('h3', {}, [document.createTextNode(f.fittingType)])];
    if (f.colourNames) children.push(colourDots(f.colourNames));
    children.push(priceP);
    children.push(el('span', { class: 'fitting-card__cta' }, [
      document.createTextNode(f.colourNames && f.colourNames.length === 1 ? 'View product →' : 'Choose colour →'),
    ]));
    return el('a', { class: 'fitting-card', href: `product.html?id=${encodeURIComponent(f.id)}` }, children);
  }

  // ---------- product.html : fitting-type detail with colour selector ----------
  function renderProductPage(catalog) {
    const wrap = document.getElementById('productDetail');
    if (!wrap) return;
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    const product = catalog.products.find((p) => p.id === id);
    const breadcrumb = document.getElementById('breadcrumb');

    if (!product) {
      wrap.innerHTML = '';
      wrap.appendChild(el('h1', {}, [document.createTextNode('Product not found')]));
      wrap.appendChild(el('p', {}, [document.createTextNode('Please choose a product from the full range.')]));
      return;
    }

    const cat = catalog.categories.find((c) => c.slug === product.categorySlug);
    const profile = cat && cat.hasProfiles && product.profileSlug
      ? cat.profiles.find((p) => p.slug === product.profileSlug)
      : null;

    document.title = `${product.fittingType} — ${profile ? profile.name + ' — ' : ''}${product.categoryName} | WBPlastics`;
    breadcrumb.appendChild(document.createTextNode(' / '));
    breadcrumb.appendChild(el('a', { href: `category.html?cat=${encodeURIComponent(product.categorySlug)}` }, [document.createTextNode(product.categoryName)]));
    breadcrumb.appendChild(document.createTextNode(' / '));
    if (profile) {
      breadcrumb.appendChild(el('a', { href: `category.html?cat=${encodeURIComponent(product.categorySlug)}&profile=${encodeURIComponent(profile.slug)}` }, [document.createTextNode(profile.name)]));
      breadcrumb.appendChild(document.createTextNode(' / '));
    }
    breadcrumb.appendChild(el('span', {}, [document.createTextNode(product.fittingType)]));

    wrap.innerHTML = '';

    const head = el('div', { class: 'product-detail__head' }, [
      el('p', { class: 'eyebrow' }, [document.createTextNode(profile ? `${product.categoryName} — ${profile.name}` : product.categoryName)]),
      el('h1', {}, [document.createTextNode(product.fittingType)]),
      el('p', { class: 'product-detail__count' }, [
        document.createTextNode(product.existingColoursOnly
          ? `Available in ${product.colours.length} colour${product.colours.length === 1 ? '' : 's'}: ${product.colours.map((c) => c.name).join(', ')}.`
          : `${product.itemCount} stock line${product.itemCount === 1 ? '' : 's'} in this fitting type across our 5 colour options.`),
      ]),
    ]);
    wrap.appendChild(head);

    const body = el('div', { class: 'product-detail__body' }, []);
    wrap.appendChild(body);

    // Left column: product image (changes with the chosen colour) above the colour selector.
    const mainCol = el('div', { class: 'product-detail__main' }, []);
    body.appendChild(mainCol);
    const gallery = el('div', { class: 'product-image' }, []);
    mainCol.appendChild(gallery);

    // Colour selector
    const selectorWrap = el('div', { class: 'colour-selector' }, [
      el('h2', {}, [document.createTextNode('Choose Your Colour')]),
    ]);
    const swatchRow = el('div', { class: 'colour-swatches', role: 'radiogroup', 'aria-label': 'Colour' }, []);
    selectorWrap.appendChild(swatchRow);
    mainCol.appendChild(selectorWrap);

    // Info panel (updates on colour selection)
    const infoPanel = el('div', { class: 'product-info-panel' }, []);
    body.appendChild(infoPanel);

    const colourKeyMap = COLOUR_HEX;

    // Shows the photo for the chosen colour if one has been added (assets/products/<SKU>.jpg,
    // see assets/products/README.md), otherwise a placeholder tinted with that colour.
    let imageRequest = 0;
    function renderImage(colour) {
      const request = ++imageRequest;
      const hex = colourKeyMap[colour.name] || '#ccc';
      gallery.innerHTML = '';
      gallery.appendChild(el('div', { class: 'product-image__placeholder', role: 'img', 'aria-label': `${product.fittingType} in ${colour.name} — image coming soon` }, [
        el('span', { class: 'product-image__icon', html: PLACEHOLDER_ICON }, []),
        el('span', { class: 'product-image__label' }, [document.createTextNode('Image coming soon')]),
        el('span', { class: 'product-image__colour' }, [
          el('span', { class: 'product-image__dot', style: `background:${hex}` }, []),
          document.createTextNode(`${product.fittingType} — ${colour.name}`),
        ]),
      ]));
      if (!colour.sku) return;
      const img = new Image();
      img.className = 'product-image__photo';
      img.alt = `${product.fittingType} in ${colour.name}`;
      img.onload = () => {
        if (request !== imageRequest) return; // a different colour was picked meanwhile
        gallery.innerHTML = '';
        gallery.appendChild(img);
      };
      img.src = productImagePath(colour.sku);
    }

    function renderInfoPanel(colour) {
      renderImage(colour);
      infoPanel.innerHTML = '';
      const nameRow = el('div', { class: 'product-info-panel__name' }, [
        document.createTextNode(`${product.fittingType} — ${colour.name}`),
      ]);
      infoPanel.appendChild(nameRow);

      if (colour.available) {
        const priceText = fmtPrice(colour.price);
        const priceEls = priceText
          ? [document.createTextNode(priceText + ' '), el('span', { class: 'vat-note' }, [document.createTextNode('Inc VAT')])]
          : [document.createTextNode('Call for pricing')];
        infoPanel.appendChild(el('p', { class: 'product-info-panel__price' }, priceEls));
        if (colour.sku) {
          infoPanel.appendChild(el('p', { class: 'product-info-panel__sku' }, [document.createTextNode(`SKU: ${colour.sku}`)]));
        }
        infoPanel.appendChild(el('p', { class: 'product-info-panel__status product-info-panel__status--in' }, [document.createTextNode('In stock')]));
      } else {
        infoPanel.appendChild(el('p', { class: 'product-info-panel__status product-info-panel__status--order' }, [
          document.createTextNode(colour.note || 'Not currently a stocked colour for this fitting — available to order. Call or WhatsApp us to confirm price and lead time.'),
        ]));
      }

      const ctaRow = el('div', { class: 'product-info-panel__cta' }, [
        el('a', { class: 'btn btn--primary', href: PHONE_HREF }, [document.createTextNode(`Call ${PHONE_DISPLAY}`)]),
        el('a', { class: 'btn btn--whatsapp', href: WHATSAPP, target: '_blank', rel: 'noopener' }, [document.createTextNode('WhatsApp Us')]),
      ]);
      infoPanel.appendChild(ctaRow);
    }

    let selectedIndex = product.colours.findIndex((c) => c.available);
    if (selectedIndex === -1) selectedIndex = 0;

    product.colours.forEach((colour, i) => {
      const swatch = el('button', {
        type: 'button',
        class: `colour-swatch${i === selectedIndex ? ' is-selected' : ''}${colour.available ? '' : ' is-unavailable'}`,
        role: 'radio',
        'aria-checked': i === selectedIndex ? 'true' : 'false',
        title: colour.available ? colour.name : `${colour.name} (available to order)`,
      }, []);
      const dot = el('span', { class: 'colour-swatch__dot', style: `background:${colourKeyMap[colour.name] || '#ccc'}` }, []);
      const label = el('span', { class: 'colour-swatch__label' }, [document.createTextNode(colour.name)]);
      swatch.appendChild(dot);
      swatch.appendChild(label);
      swatch.addEventListener('click', () => {
        swatchRow.querySelectorAll('.colour-swatch').forEach((s) => {
          s.classList.remove('is-selected');
          s.setAttribute('aria-checked', 'false');
        });
        swatch.classList.add('is-selected');
        swatch.setAttribute('aria-checked', 'true');
        renderInfoPanel(colour);
      });
      swatchRow.appendChild(swatch);
    });

    renderInfoPanel(product.colours[selectedIndex]);

    // Other fitting types in this profile (or category, if it has no profile branch)
    if (cat) {
      const scopeFittingTypes = profile ? profile.fittingTypes : cat.fittingTypes;
      const scopeLabel = profile ? `${profile.name} (${product.categoryName})` : product.categoryName;
      const backHref = profile
        ? `category.html?cat=${encodeURIComponent(product.categorySlug)}&profile=${encodeURIComponent(profile.slug)}`
        : `category.html?cat=${encodeURIComponent(product.categorySlug)}`;
      const others = scopeFittingTypes.filter((f) => f.id !== product.id).sort((a, b) => a.fittingType.localeCompare(b.fittingType));
      if (others.length) {
        const otherWrap = el('div', { class: 'related-fittings' }, [
          el('h2', {}, [document.createTextNode(`More in ${scopeLabel}`)]),
        ]);
        const list = el('div', { class: 'related-fittings__grid' }, []);
        others.slice(0, 8).forEach((f) => {
          list.appendChild(el('a', { class: 'related-fittings__item', href: `product.html?id=${encodeURIComponent(f.id)}` }, [document.createTextNode(f.fittingType)]));
        });
        otherWrap.appendChild(list);
        otherWrap.appendChild(el('p', { class: 'related-fittings__more' }, [
          el('a', { href: backHref }, [document.createTextNode(`View all of ${scopeLabel} →`)]),
        ]));
        wrap.appendChild(otherWrap);
      }
    }
  }

  function init() {
    if (!document.getElementById('categoryGrid') && !document.getElementById('fittingGrid') && !document.getElementById('productDetail')) {
      return; // not a catalog page
    }
    fetchCatalog()
      .then((catalog) => {
        renderCategoryHub(catalog);
        renderCategoryPage(catalog);
        renderProductPage(catalog);
      })
      .catch((err) => {
        console.error(err);
        ['categoryGrid', 'fittingGrid', 'productDetail'].forEach((id) => {
          const node = document.getElementById(id);
          if (node) node.innerHTML = '<p class="catalog-loading">Sorry, something went wrong loading the product catalogue. Please call us on <a href="tel:01204792000">01204 792 000</a>.</p>';
        });
      });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
