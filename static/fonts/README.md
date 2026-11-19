# Fonts

The design pairs **ITC Avant Garde Gothic** with **Cooper BT**. Both are commercial typefaces whose
licences don't cover web embedding without a paid web licence, so the site uses open-licence equivalents:

| Role | Intended | Shipped | Licence |
|---|---|---|---|
| Headlines, interface, body | ITC Avant Garde Gothic | **TeX Gyre Adventor** (this folder), a digitisation of URW Gothic, itself an Avant Garde design | GUST Font License (LPPL instance), free to use and redistribute |
| Display serif, italic accents | Cooper BT | **Fraunces** with the `SOFT` axis at 100 (npm `@fontsource-variable/fraunces`) | SIL Open Font License 1.1 |
| Code samples only | — | JetBrains Mono (npm) | SIL Open Font License 1.1 |

The Adventor files here are TeX Gyre Adventor 2.x (Copyright 2007–2018 B. Jackowski, J. M. Nowacki et al.,
on behalf of the TeX Users Groups), converted unchanged in design to WOFF2 and limited to Latin characters.
Source and full licence: https://www.gust.org.pl/projects/e-foundry/tex-gyre/adventor

## Using the licensed originals instead

If you buy web licences for ITC Avant Garde Gothic and Cooper BT, put the `.woff2` files in this folder,
add `@font-face` rules for them in `src/app.css`, and put their family names first in `--sans` and `--serif`.
Nothing else needs to change.
