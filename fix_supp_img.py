with open('frontend/src/pages/Dashboard.jsx', 'r', encoding='utf-8') as f:
    src = f.read()

# 1. Update the image block renderer to support size='product'
old_renderer = """            case 'image':
              return (
                <div key={i} className="my-6 flex justify-center">
                  <img src={block.src} alt={block.alt || ''} className={`rounded-xl ${block.fit === 'contain' ? 'max-h-65 object-contain' : 'w-full object-cover max-h-72'}`} />
                </div>
              );"""

new_renderer = """            case 'image':
              if (block.size === 'product') {
                return (
                  <div key={i} className="my-3 flex justify-center">
                    <img src={block.src} alt={block.alt || ''} className="h-44 w-auto max-w-[200px] object-contain rounded-xl bg-white/5" />
                  </div>
                );
              }
              return (
                <div key={i} className="my-6 flex justify-center">
                  <img src={block.src} alt={block.alt || ''} className={`rounded-xl ${block.fit === 'contain' ? 'max-h-65 object-contain' : 'w-full object-cover max-h-72'}`} />
                </div>
              );"""

if old_renderer in src:
    src = src.replace(old_renderer, new_renderer)
    print("Image renderer updated")
else:
    print("Image renderer NOT found!")

# 2. Tag all supplement product images with size: 'product'
# These are all images within lesson 2-3 (supplement images)
supp_images = [
    "{ type: 'image', src: '/supp-m1-creatine.webp', alt: 'Muscle First Pro Creatine' }",
    "{ type: 'image', src: '/supp-crevolene.webp', alt: 'Crevolene Creatine' }",
    "{ type: 'image', src: '/supp-provus-creatine.jpg', alt: 'Provus Creatine' }",
    "{ type: 'image', src: '/supp-now-omega3.webp', alt: 'NOW Ultra Omega 3' }",
    "{ type: 'image', src: '/supp-blackmores.webp', alt: 'Blackmores Fish Oil' }",
    "{ type: 'image', src: '/supp-m1-gainer.webp', alt: 'M1 Pro Gainer' }",
    "{ type: 'image', src: '/supp-evomass.webp', alt: 'EVOMASS Gainer' }",
    "{ type: 'image', src: '/supp-massiv.webp', alt: 'Massiv Fitlife Gainer' }",
    "{ type: 'image', src: '/supp-provus-gainer.webp', alt: 'Provus Mega Mass Gainer' }",
    "{ type: 'image', src: '/supp-evo-whey.webp', alt: 'Evolene EvoWhey' }",
    "{ type: 'image', src: '/supp-pro-whey.webp', alt: 'Muscle First Pro Whey' }",
    "{ type: 'image', src: '/supp-provus-whey.webp', alt: 'Provus Premium Whey Gold' }",
]

count = 0
for img in supp_images:
    tagged = img.replace("{ type: 'image', src:", "{ type: 'image', size: 'product', src:")
    if img in src:
        src = src.replace(img, tagged)
        count += 1
    else:
        print(f"  NOT FOUND: {img[:60]}")

print(f"Tagged {count}/{len(supp_images)} supplement images with size='product'")

with open('frontend/src/pages/Dashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(src)
print("Dashboard.jsx saved")
