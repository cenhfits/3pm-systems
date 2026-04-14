with open('frontend/src/pages/Dashboard.jsx', 'r', encoding='utf-8') as f:
    src = f.read()

# New lesson to insert after lesson 2-2
new_lesson = """      { id: '2-3', type: 'text', title: 'Supplement Needs', duration: '8 min', content: [
        { type: 'callout', icon: '⚠️', text: '**Important:** Suplemen WHEY, GAINER, dan OMEGA 3 lo **ga wajib beli** kalau lo udah bisa memenuhinya lewat real food. Yang wajib lo beli cuma **Creatine**. Ingat — suplemen itu cuma bantu memenuhi kebutuhan lo pas lagi ga sempat atau ga bisa konsumsi dari makanan.' },
        { type: 'heading2', text: '1. Creatine' },
        { type: 'heading3', text: 'Muscle First Pro Creatine' },
        { type: 'image', src: '/supp-m1-creatine.webp', alt: 'Muscle First Pro Creatine' },
        { type: 'link_card', href: 'https://shopee.co.id/MUSCLE-FIRST-Pro-Creatine-360gr-Menambah-Massa-Otot-Suplemen-Fitness-i.8802988.289998377', text: '🛒 Beli di Shopee — Official Store' },
        { type: 'heading3', text: 'Crevolene' },
        { type: 'image', src: '/supp-crevolene.webp', alt: 'Crevolene Creatine' },
        { type: 'link_card', href: 'https://shopee.co.id/Evolene-NUQDgwqVE-6aMBLYLbQv6i5N5y7bC5SajqSjHPzt8UJUqbZ8a-Otot-Suplemen-Fitness-i.244776591.24157750608', text: '🛒 Beli di Shopee — Official Store' },
        { type: 'heading3', text: 'Provus Creatine' },
        { type: 'image', src: '/supp-provus-creatine.jpg', alt: 'Provus Creatine' },
        { type: 'link_card', href: 'https://shopee.co.id/Provus-Creatine-Matrix-300gr-(Kemasan-Lama)-Unflavored-i.1088395013.46954913369', text: '🛒 Beli di Shopee — Official Store' },
        { type: 'divider' },
        { type: 'heading2', text: '2. Omega 3' },
        { type: 'callout', icon: '💡', text: 'Kalau lo udah rutin konsumsi ikan, suplemen Omega 3 ini **ga perlu dibeli**.' },
        { type: 'heading3', text: 'NOW Ultra Omega 3' },
        { type: 'image', src: '/supp-now-omega3.webp', alt: 'NOW Ultra Omega 3' },
        { type: 'link_card', href: 'https://shopee.co.id/NOW-Ultra-Omega-3-Fish-OIl-90-Softgels-i.789452017.21475465102', text: '🛒 Beli di Shopee — Official Store' },
        { type: 'heading3', text: 'Blackmores Fish Oil' },
        { type: 'image', src: '/supp-blackmores.webp', alt: 'Blackmores Fish Oil' },
        { type: 'link_card', href: 'https://shopee.co.id/Blackmores-Ultimate-Omega-Odourless-Minyak-Ikan-Tidak-Berbau-1-Kapsul-Sehari-Isi-60-Kapsul-(Membantu-Memelihara-Kesehatan)-BPOM-HALAL-i.204176418.4109712057', text: '🛒 Beli di Shopee — Official Store' },
        { type: 'divider' },
        { type: 'heading2', text: '3. Gainer' },
        { type: 'heading3', text: 'M1 Pro Gainer' },
        { type: 'image', src: '/supp-m1-gainer.webp', alt: 'M1 Pro Gainer' },
        { type: 'link_card', href: 'https://shopee.co.id/MUSCLE-FIRST-Pro-Gainer-2lbs-900gr-Mass-Gainer-Penambah-Berat-Badan-i.8802988.896956194', text: '🛒 Beli di Shopee — Official Store' },
        { type: 'heading3', text: 'EVOMASS' },
        { type: 'image', src: '/supp-evomass.webp', alt: 'EVOMASS Gainer' },
        { type: 'link_card', href: 'https://shopee.co.id/Evolene-Evomass-10-lbs-4500gr-Mass-Gainer-Suplemen-Fitness-i.244776591.7927678019', text: '🛒 Beli di Shopee — Official Store' },
        { type: 'heading3', text: 'Massiv Gainer' },
        { type: 'image', src: '/supp-massiv.webp', alt: 'Massiv Fitlife Gainer' },
        { type: 'link_card', href: 'https://shopee.co.id/FITlife-Massiv-Gainer-5-lbs-2260-gram-(MPro-Upgraded)-i.180143494.7109556935', text: '🛒 Beli di Shopee — Official Store' },
        { type: 'heading3', text: 'Provus Gainer' },
        { type: 'image', src: '/supp-provus-gainer.webp', alt: 'Provus Mega Mass Gainer' },
        { type: 'link_card', href: 'https://shopee.co.id/Provus-Mega-Mass-3-lb-6-Serving-Weight-Gainer-Penambah-Berat-Badan-i.6348001.23933372225', text: '🛒 Beli di Shopee — Official Store' },
        { type: 'divider' },
        { type: 'heading2', text: '4. Whey' },
        { type: 'heading3', text: 'Whey Evolene' },
        { type: 'image', src: '/supp-evo-whey.webp', alt: 'Evolene EvoWhey' },
        { type: 'link_card', href: 'https://shopee.co.id/Evolene-EvoWhey-Evosorption-Whey-Protein-50-Serving-1550gr-Suplemen-Fitness-i.244776591.25838061460', text: '🛒 Beli di Shopee — Official Store' },
        { type: 'heading3', text: 'Pro Whey' },
        { type: 'image', src: '/supp-pro-whey.webp', alt: 'Muscle First Pro Whey' },
        { type: 'link_card', href: 'https://shopee.co.id/MUQDgwqVE-6aMBLYLbQv6i5N5y7bC5SajqSjHPzt8UJUqbZ8a-Suplemen-Fitness-i.8802988.5876940790', text: '🛒 Beli di Shopee — Official Store' },
        { type: 'heading3', text: 'Provus Whey' },
        { type: 'image', src: '/supp-provus-whey.webp', alt: 'Provus Premium Whey Gold' },
        { type: 'link_card', href: 'https://shopee.co.id/Provus-Premium-Whey-Gold-900gr-Whey-Protein-Concentrate-i.1088395013.27004990140', text: '🛒 Beli di Shopee — Official Store' },
      ] },
"""

# Insert after lesson 2-2 closing, before the lessons array closing
old_marker = "      ] },\n    ],\n  },\n  {\n    id: 3,"
new_marker = "      ] }," + "\n" + new_lesson + "    ],\n  },\n  {\n    id: 3,"

if old_marker in src:
    src = src.replace(old_marker, new_marker, 1)
    print("Lesson 2-3 inserted successfully")
else:
    print("Marker not found, searching...")
    idx = src.find("'2-2'")
    print(f"2-2 found at index: {idx}")
    # Try to find the closing of 2-2
    end_2_2 = src.find("] },\n    ],", idx)
    print(f"End of 2-2 at: {end_2_2}")
    print(repr(src[end_2_2:end_2_2+60]))

with open('frontend/src/pages/Dashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(src)
print("Dashboard.jsx saved")
