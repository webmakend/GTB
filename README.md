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
| `index.html` | Gebouwde game (template + wereld-data) |
| `src/template.html` | Broncode van de game (`__WORLD__` wordt vervangen door de kaartdata) |
| `data/game.json` | Wereld uit OpenStreetMap (vesting, wegen, gebouwen, water, bedrijven) |
| `tools/` | Python-scripts: OSM → wereld (`osm2world.py`, `island.py`), bedrijven koppelen (`biz2.py`), `build.py` |
| `assets/` | Muziek, intro-artwork en logo |
| `godot/engine_sound.gd` | Procedureel motorgeluid voor Godot 4.3 (`AudioStreamGenerator`) |

## Bouwen
```
python3 tools/build.py
```

## Bronnen
Kaartdata © OpenStreetMap-bijdragers (ODbL).
