<?php
/**
 * GTB Bommel – kleine online server (PHP 7.4+ met PDO SQLite).
 * Zet dit bestand naast index.html. Het spel vindt api.php vanzelf.
 *
 *   POST api.php?a=ping   body: JSON met je spelerstatus  -> spelers die nu online zijn + top 50
 *   GET  api.php?a=top                                    -> top 50 (blijvende ranglijst)
 *   GET  api.php?a=hello                                  -> {"ok":true}
 *
 * De database (gtb.sqlite) wordt automatisch aangemaakt in data/ (die map moet schrijfbaar zijn).
 */
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
// Zelfde domein is genoeg; wil je het spel op een ander domein draaien, zet dan hier dat domein.
// header('Access-Control-Allow-Origin: https://jouwdomein.nl');

$dir = __DIR__ . '/data';
if (!is_dir($dir)) { @mkdir($dir, 0775, true); @file_put_contents($dir . '/.htaccess', "Require all denied\nDeny from all\n"); }
try {
  $db = new PDO('sqlite:' . $dir . '/gtb.sqlite');
  $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  $db->exec('PRAGMA journal_mode=WAL');
  $db->exec('CREATE TABLE IF NOT EXISTS players (id TEXT PRIMARY KEY, nm TEXT, lv INT, xp INT, mu INT, pr INT, eur INT, state TEXT, seen INT, ip TEXT)');
  $db->exec('CREATE INDEX IF NOT EXISTS i_xp ON players(xp DESC)');
  $db->exec('CREATE INDEX IF NOT EXISTS i_seen ON players(seen)');
} catch (Exception $e) { http_response_code(500); echo json_encode(['ok' => false]); exit; }

function top($db) {
  $q = $db->query('SELECT id,nm,lv,xp,mu,pr,eur,seen FROM players ORDER BY xp DESC LIMIT 50');
  $out = [];
  foreach ($q as $r) $out[] = ['id' => substr(hash('sha256', $r['id']), 0, 10), 'nm' => $r['nm'], 'lv' => (int)$r['lv'], 'xp' => (int)$r['xp'], 'mu' => (int)$r['mu'], 'pr' => (int)$r['pr'], 'eur' => (int)$r['eur'], 'on' => (time() - (int)$r['seen']) < 12];
  return $out;
}
$a = $_GET['a'] ?? '';
if ($a === 'hello') { echo json_encode(['ok' => true]); exit; }
if ($a === 'top') { echo json_encode(['ok' => true, 'top' => top($db)]); exit; }
if ($a !== 'ping' || $_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(400); echo json_encode(['ok' => false]); exit; }

$raw = file_get_contents('php://input', false, null, 0, 8192);
$in = json_decode($raw, true);
if (!is_array($in)) { http_response_code(400); echo json_encode(['ok' => false]); exit; }
$id = preg_replace('/[^a-zA-Z0-9]/', '', (string)($in['id'] ?? ''));
if (strlen($id) < 12 || strlen($id) > 40) { http_response_code(400); echo json_encode(['ok' => false]); exit; }
$nm = mb_substr(trim(preg_replace('/[\x00-\x1F<>&"]/u', '', (string)($in['nm'] ?? 'Speler'))), 0, 14) ?: 'Speler';
$num = function ($k, $min, $max) use ($in) { $v = (int)($in[$k] ?? 0); return max($min, min($max, $v)); };
$st = [
  'nm' => $nm, 'ch' => preg_replace('/[^a-z]/', '', (string)($in['ch'] ?? '')),
  'x' => $num('x', 0, 20000), 'y' => $num('y', 0, 20000), 'a' => round((float)($in['a'] ?? 0), 2),
  'car' => in_array($in['car'] ?? '', ['', 'b', 'c'], true) ? $in['car'] : '',
  'col' => preg_match('/^#[0-9a-fA-F]{3,6}$/', (string)($in['col'] ?? '')) ? $in['col'] : '',
  'lv' => $num('lv', 1, 99), 'st' => $num('st', 0, 5),
  'eur' => $num('eur', -1000000, 100000000), 'dead' => $num('dead', 0, 1),
  'pid' => preg_match('/^[0-9a-f]{12}$/', (string)($in['pid'] ?? '')) ? $in['pid'] : '',
  'ev' => [],
  'cm' => null,
];
if (is_array($in['cm'] ?? null) && trim((string)($in['cm']['t'] ?? '')) !== '') $st['cm'] = ['i' => max(0, min(1000000000, (int)($in['cm']['i'] ?? 0))), 't' => mb_substr(trim(preg_replace('/[\x00-\x1F<>]/u', '', (string)$in['cm']['t'])), 0, 80)];
// gebeurtenissen tussen spelers (raak, neergeschoten, vriendschap): alleen bekende soorten, max 12
foreach (array_slice(is_array($in['ev'] ?? null) ? $in['ev'] : [], 0, 12) as $e) {
  if (!is_array($e) || !in_array($e['k'] ?? '', ['hit', 'kill', 'frq', 'fok', 'frm'], true)) continue;
  if (!preg_match('/^[0-9a-f]{12}$/', (string)($e['to'] ?? ''))) continue;
  $st['ev'][] = ['k' => $e['k'], 'to' => $e['to'], 'i' => max(0, min(1000000000, (int)($e['i'] ?? 0))), 'd' => max(0, min(100000, (int)($e['d'] ?? 0)))];
}
$xp = $num('xp', 0, 50000000);
$stmt = $db->prepare('INSERT INTO players (id,nm,lv,xp,mu,pr,eur,state,seen,ip) VALUES (?,?,?,?,?,?,?,?,?,?)
  ON CONFLICT(id) DO UPDATE SET nm=excluded.nm,lv=excluded.lv,xp=MAX(players.xp,excluded.xp),mu=excluded.mu,pr=excluded.pr,eur=excluded.eur,state=excluded.state,seen=excluded.seen,ip=excluded.ip');
$stmt->execute([$id, $nm, $st['lv'], $xp, $num('mu', 0, 25), $num('pr', 0, 200), $num('eur', -1000000, 100000000), json_encode($st), time(), substr(hash('sha256', $_SERVER['REMOTE_ADDR'] ?? ''), 0, 16)]);

$peers = [];
$q = $db->prepare('SELECT id,state,xp FROM players WHERE seen > ? AND id <> ? ORDER BY seen DESC LIMIT 60');
$q->execute([time() - 10, $id]);
foreach ($q as $r) { $s = json_decode($r['state'], true) ?: []; $s['xp'] = (int)$r['xp']; $peers[] = ['peer' => substr(hash('sha256', $r['id']), 0, 10), 'presence' => $s]; }
$out = ['ok' => true, 'peers' => $peers];
if (($in['top'] ?? 0)) $out['top'] = top($db);
echo json_encode($out);
