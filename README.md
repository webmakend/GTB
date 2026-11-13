# GTB – Grand Theft Bommel

GTA-achtige 2D top-down browsergame in de vesting van Zaltbommel. Mobile-first, draait volledig in de browser (HTML5 canvas + Web Audio, geen frameworks).

## Spelen
Open `index.html` via een webserver (bijv. GitHub Pages of `python3 -m http.server`). De muziek staat in `assets/`.

**Bediening**
- Telefoon: joystick links (slepen), GOOI / REM, SPRING, IN/UIT STAP, knijpen om te zoomen.
- Laptop: WASD/pijlen, Shift rennen, Spatie gooien/handrem, J springen, E in/uitstappen, M kaart, muiswiel zoom, P pauze.

**Missies**
1. Breng een bezoek aan de Sint-Maartenskerk (Kerkplein 1) → €20 + gouden waterballonnen.
2. Koop zonnebrand bij de Kruidvat (Boschstraat) en smeer de meid op het strand in.

## Mappen
| Map | Inhoud |
|---|---|
| `index.html` | Gebouwde game: alles in één bestand (gegenereerd, niet met de hand aanpassen) |
| `src/index.html`, `src/style.css` | Opmaak en schermen (intro, personagekeuze, knoppen) |
| `src/js/` | De game in losse modules, op volgorde geladen (00-basis … 22-start) |
| `src/js/13a-camera.js` | Camera: vertraging bij snelheid, trauma-shake, zoom-stoot |
| `src/js/14a-licht.js` | WebGL-lichtkaart met PixiJS: lantaarns met schaduwen, koplampen, neon |
| `vendor/pixi.min.js` | PixiJS 8 (MIT), zelf gebundeld uit de broncode (`tools/build-pixi.mjs`) |
| `data/game.json` | Wereld uit OpenStreetMap (vesting, wegen, gebouwen, water, bedrijven) |
| `tools/` | `build.mjs` (bouwt index.html), OSM-scripts (`osm2world.py`, `island.py`), bedrijven koppelen (`biz2.py`) |
| `assets/` | Muziek, intro-artwork, logo, personages (`char_*.webp`) en auto-sprites (`cars.png`) |
| `tools/render_cars.py`, `tools/fbx.py` | Rendert 3D-auto's (FBX) van bovenaf naar sprites; FBX-lezer zonder externe libraries |
| `godot/engine_sound.gd` | Procedureel motorgeluid voor Godot 4.3 (`AudioStreamGenerator`) |

## Bouwen
```
node tools/build.mjs          # leesbaar
node tools/build.mjs --min    # verkleind (npm i -D esbuild)
```
Alle modules in `src/js/` delen één scope en worden in alfabetische volgorde achter elkaar gezet.

## Lagen in beeld
1. `#c` — wereld (Canvas 2D): grond, gebouwen, auto's, mensen
2. `#lightc` — lichtkaart (PixiJS/WebGL) met `mix-blend-mode: multiply`; valt terug op canvas-belichting zonder WebGL
3. `#fxc` — gloed, markeringen, tekstballonnen en HUD

## Bronnen
Kaartdata © OpenStreetMap-bijdragers (ODbL).

3D-auto's: Designersoup Low Poly Car Pack Volume 1, van bovenaf gerenderd naar `assets/cars.png`.
