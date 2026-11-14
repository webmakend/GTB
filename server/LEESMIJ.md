# GTB Bommel op je eigen hosting

Het spel is één `index.html` plus de map `assets/`. Met `api.php` erbij kun je ook online samen spelen en is er een blijvende ranglijst.

## Wat heb je nodig
- Gewone webhosting met **PHP 7.4 of hoger** en de PDO-SQLite-extensie (staat bijna overal standaard aan).
- Geen MySQL nodig: de database is één bestand (`data/gtb.sqlite`) dat vanzelf wordt aangemaakt.

## Installeren
1. Maak een map op je server, bijvoorbeeld `public_html/bommel/`.
2. Upload daarin:
   - `index.html`
   - de map `assets/` (met alle afbeeldingen en muziek)
   - `server/api.php` → zet hem **naast** `index.html` (dus `bommel/api.php`)
3. Zorg dat PHP in die map een submap `data/` mag aanmaken (schrijfrechten 775). De map krijgt automatisch een `.htaccess` die downloaden blokkeert.
4. Open `https://jouwdomein.nl/bommel/`. Werkt `https://jouwdomein.nl/bommel/api.php?a=hello` (je ziet `{"ok":true}`), dan schakelt het spel online spelen vanzelf in.

## Wat spelers dan zien
- Andere spelers lopen of rijden live rond als paarse "spookspeler" met naam en level, ook op de minikaart.
- 🌐 met het aantal spelers online. Tik erop voor de ranglijst.
- De ranglijst toont de **top 50 aller tijden** (op respect), met een groen bolletje bij wie nu online is.

## Goed om te weten
- Het spel stuurt ongeveer één keer per seconde de positie en score; dat is licht voor gewone hosting (tientallen spelers tegelijk is geen probleem).
- Scores komen van de spelers zelf. Wil je valsspelen tegengaan, dan kun je in `api.php` grenzen inbouwen (bijvoorbeeld maximale respect-stijging per minuut).
- Gebruik je HTTPS, dan werkt ook geluid en trillen op telefoons het best.
