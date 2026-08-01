# djhollyweed.com

Static site — no build step. Open `index.html` or deploy the folder as-is.

## Launch on GitHub Pages
1. Create a new repo (e.g. `djhollyweed-site`), public.
2. Upload every file in this folder to the repo root (drag and drop works: **Add file → Upload files**).
3. **Settings → Pages** → Source: *Deploy from a branch* → Branch: `main`, folder `/ (root)` → Save.
4. Live in ~1 min at `https://<username>.github.io/<repo>/`.

## Custom domain
Settings → Pages → Custom domain → `djhollyweed.com`. At your registrar add
A records for `@` → 185.199.108.153, .109.153, .110.153, .111.153 and a
CNAME for `www` → `<username>.github.io`. Then tick *Enforce HTTPS*.

## Photos
The dark boxes are drop targets in the local preview only. For the live site,
put real files in this folder (e.g. `hero.jpg`) and swap each
`<image-slot …></image-slot>` for:
`<img src="hero.jpg" alt="" style="width:100%;height:100%;object-fit:cover">`

Slots to fill: hw-hero (vertical press shot), hw-about (booth/crowd),
hw-g1…hw-g4 (gallery row).

## Details baked in
- Bookings: ms.hollyweed@gmail.com
- Instagram: @djhollyweed
- Burning Man 2026 — Camp VIP (Very Inappropriate People), 4:45 & Esplanade
- Southwest Flow Festival 2026
