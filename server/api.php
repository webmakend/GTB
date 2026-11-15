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
  try { $db->exec('ALTER TABLE players ADD COLUMN pub TEXT'); } catch (Exception $e) {}
  $db->exec('CREATE TABLE IF NOT EXISTS dms (id INTEGER PRIMARY KEY AUTOINCREMENT, too TEXT, frm TEXT, nm TEXT, t TEXT, ts INT)');
  $db->exec('CREATE INDEX IF NOT EXISTS i_dm ON dms(too, id)');
  $db->exec('CREATE TABLE IF NOT EXISTS houses (oid TEXT PRIMARY KEY, pid TEXT, nm TEXT, name TEXT, ts INT)');
  $db->exec('CREATE TABLE IF NOT EXISTS tags (id INTEGER PRIMARY KEY AUTOINCREMENT, oid TEXT, k TEXT, t TEXT, c TEXT, tid TEXT, ts INT)');
  $db->exec('CREATE INDEX IF NOT EXISTS i_tags ON tags(oid, id)');
  $db->exec('CREATE TABLE IF NOT EXISTS pay (id INTEGER PRIMARY KEY AUTOINCREMENT, too TEXT, nm TEXT, name TEXT, amt INT, ts INT)');
} catch (Exception $e) { http_response_code(500); echo json_encode(['ok' => false]); exit; }

function top($db) {
  $q = $db->query('SELECT id,nm,lv,xp,mu,pr,eur,seen,pub FROM players ORDER BY xp DESC LIMIT 100');
  $out = [];
  foreach ($q as $r) $out[] = ['id' => substr(hash('sha256', $r['id']), 0, 10), 'pid' => (string)$r['pub'], 'nm' => $r['nm'], 'lv' => (int)$r['lv'], 'xp' => (int)$r['xp'], 'mu' => (int)$r['mu'], 'pr' => (int)$r['pr'], 'eur' => (int)$r['eur'], 'seen' => (int)$r['seen'], 'on' => (time() - (int)$r['seen']) < 12];
  return $out;
}
$a = $_GET['a'] ?? '';
if ($a === 'hello') { echo json_encode(['ok' => true]); exit; }
if ($a === 'top') { echo json_encode(['ok' => true, 'top' => top($db)]); exit; }
if ($a === 'houses') {
  // met de verzameling van de eigenaar (voor de vitrine in het huis)
  $q = $db->query('SELECT h.oid,h.pid,h.nm,h.name,(SELECT state FROM players p WHERE p.pub = h.pid ORDER BY seen DESC LIMIT 1) AS st FROM houses h LIMIT 5000'); $out = [];
  foreach ($q as $r) { $s = json_decode((string)$r['st'], true) ?: []; $out[] = ['oid' => $r['oid'], 'pid' => $r['pid'], 'nm' => $r['nm'], 'name' => $r['name'], 'sq' => (string)($s['sq'] ?? '')]; }
  echo json_encode(['ok' => true, 'houses' => $out]); exit;
}
if ($a === 'tags') { $oid = preg_replace('/[^0-9]/', '', (string)($_GET['oid'] ?? '')); $q = $db->prepare('SELECT k,t,c,tid FROM tags WHERE oid = ? ORDER BY id DESC LIMIT 60'); $q->execute([$oid]); $out = []; foreach (array_reverse($q->fetchAll(PDO::FETCH_ASSOC)) as $r) $out[] = [$r['k'], $r['t'], $r['c'], $r['tid']]; echo json_encode(['ok' => true, 'tags' => $out]); exit; }
if ($a === 'tag' && $_SERVER['REQUEST_METHOD'] === 'POST') {
  // graffiti op een muur in iemands huis
  $in = json_decode(file_get_contents('php://input', false, null, 0, 2048), true) ?: [];
  $id = preg_replace('/[^a-zA-Z0-9]/', '', (string)($in['id'] ?? '')); $oid = preg_replace('/[^0-9]/', '', (string)($in['oid'] ?? ''));
  $k = (string)($in['k'] ?? ''); $t = mb_substr(trim(preg_replace('/[\x00-\x1F<>]/u', '', (string)($in['t'] ?? ''))), 0, 12);
  $c = preg_match('/^#[0-9a-fA-F]{6}$/', (string)($in['c'] ?? '')) ? $in['c'] : '#ff2e88'; $tid = preg_replace('/[^a-z0-9]/', '', (string)($in['i'] ?? ''));
  $pl = $db->prepare('SELECT pub FROM players WHERE id = ?'); $pl->execute([$id]);
  if (!$pl->fetch() || $oid === '' || !preg_match('/^\d{1,2},\d{1,2}$/', $k) || $t === '' || $tid === '') { echo json_encode(['ok' => false]); exit; }
  $db->prepare('INSERT INTO tags (oid,k,t,c,tid,ts) VALUES (?,?,?,?,?,?)')->execute([$oid, $k, $t, $c, substr($tid, 0, 24), time()]);
  $db->prepare('DELETE FROM tags WHERE oid = ? AND id NOT IN (SELECT id FROM tags WHERE oid = ? ORDER BY id DESC LIMIT 60)')->execute([$oid, $oid]);
  echo json_encode(['ok' => true]); exit;
}
if (($a === 'buy' || $a === 'hname' || $a === 'takeover') && $_SERVER['REQUEST_METHOD'] === 'POST') {
  $in = json_decode(file_get_contents('php://input', false, null, 0, 2048), true) ?: [];
  $id = preg_replace('/[^a-zA-Z0-9]/', '', (string)($in['id'] ?? ''));
  $oid = preg_replace('/[^0-9]/', '', (string)($in['oid'] ?? ''));
  $name = mb_substr(trim(preg_replace('/[\x00-\x1F<>]/u', '', (string)($in['name'] ?? 'Mijn huis'))), 0, 10) ?: 'Mijn huis';
  $pl = $db->prepare('SELECT nm,pub FROM players WHERE id = ?'); $pl->execute([$id]); $p = $pl->fetch(PDO::FETCH_ASSOC);
  if (!$p || $oid === '' || !$p['pub']) { echo json_encode(['ok' => false, 'err' => 'onbekend']); exit; }
  if ($a === 'takeover') {
    // huis overkopen: de koper betaalt de standaardprijs + 10%, die 10% gaat naar de vorige eigenaar
    $cut = max(0, min(100000, (int)($in['cut'] ?? 0)));
    $db->beginTransaction();
    $q = $db->prepare('SELECT pid,name FROM houses WHERE oid = ?'); $q->execute([$oid]); $h = $q->fetch(PDO::FETCH_ASSOC);
    if (!$h || $h['pid'] === $p['pub'] || $h['pid'] !== (string)($in['from'] ?? '')) { $db->rollBack(); echo json_encode(['ok' => false]); exit; }
    $db->prepare('UPDATE houses SET pid = ?, nm = ?, name = ?, ts = ? WHERE oid = ?')->execute([$p['pub'], $p['nm'], 'Mijn huis', time(), $oid]);
    $db->prepare('INSERT INTO pay (too,nm,name,amt,ts) VALUES (?,?,?,?,?)')->execute([$h['pid'], $p['nm'], $h['name'], $cut, time()]);
    $db->commit(); echo json_encode(['ok' => true]); exit;
  }
  if ($a === 'buy') {
    $st2 = $db->prepare('INSERT OR IGNORE INTO houses (oid,pid,nm,name,ts) VALUES (?,?,?,?,?)'); $st2->execute([$oid, $p['pub'], $p['nm'], $name, time()]);
    echo json_encode(['ok' => $st2->rowCount() === 1]); exit;
  }
  $st2 = $db->prepare('UPDATE houses SET name = ? WHERE oid = ? AND pid = ?'); $st2->execute([$name, $oid, $p['pub']]);
  echo json_encode(['ok' => $st2->rowCount() === 1]); exit;
}
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
  'sq' => substr(preg_replace('/[^a-z_:,0-9]/', '', (string)($in['sq'] ?? '')), 0, 400),
  'cm' => null,
];
if (in_array($in['in'] ?? '', ['stadscafe', 'dorpshuis', 'intertoys'], true) || preg_match('/^h[0-9]{1,15}$/', (string)($in['in'] ?? ''))) { $st['in'] = $in['in']; $st['ix'] = round(max(0, min(40, (float)($in['ix'] ?? 0))), 2); $st['iz'] = round(max(0, min(40, (float)($in['iz'] ?? 0))), 2); }
if (is_array($in['cm'] ?? null) && trim((string)($in['cm']['t'] ?? '')) !== '') $st['cm'] = ['i' => max(0, min(1000000000, (int)($in['cm']['i'] ?? 0))), 't' => mb_substr(trim(preg_replace('/[\x00-\x1F<>]/u', '', (string)$in['cm']['t'])), 0, 80)];
// gebeurtenissen tussen spelers (raak, neergeschoten, vriendschap): alleen bekende soorten, max 12
foreach (array_slice(is_array($in['ev'] ?? null) ? $in['ev'] : [], 0, 12) as $e) {
  if (!is_array($e) || !in_array($e['k'] ?? '', ['hit', 'kill', 'frq', 'fok', 'frm', 'dm', 'gift', 'hsold'], true)) continue;
  if (!preg_match('/^[0-9a-f]{12}$/', (string)($e['to'] ?? ''))) continue;
  $st['ev'][] = ['k' => $e['k'], 'to' => $e['to'], 'i' => max(0, min(1000000000, (int)($e['i'] ?? 0))), 'd' => max(0, min(100000, (int)($e['d'] ?? 0))), 'm' => mb_substr(trim(preg_replace('/[\x00-\x1F<>]/u', '', (string)($e['m'] ?? ''))), 0, 200)];
}
$xp = $num('xp', 0, 50000000);
$stmt = $db->prepare('INSERT INTO players (id,nm,lv,xp,mu,pr,eur,state,seen,ip,pub) VALUES (?,?,?,?,?,?,?,?,?,?,?)
  ON CONFLICT(id) DO UPDATE SET nm=excluded.nm,lv=excluded.lv,xp=MAX(players.xp,excluded.xp),mu=excluded.mu,pr=excluded.pr,eur=excluded.eur,state=excluded.state,seen=excluded.seen,ip=excluded.ip,pub=excluded.pub');
$stmt->execute([$id, $nm, $st['lv'], $xp, $num('mu', 0, 25), $num('pr', 0, 200), $num('eur', -1000000, 100000000), json_encode($st), time(), substr(hash('sha256', $_SERVER['REMOTE_ADDR'] ?? ''), 0, 16), $st['pid']]);
// persoonlijke berichten: versturen (ook als de ander offline is) en je eigen postvak ophalen
$dmOut = [];
if ($st['pid'] !== '') {
  $ins = $db->prepare('INSERT INTO dms (too,frm,nm,t,ts) VALUES (?,?,?,?,?)');
  foreach (array_slice(is_array($in['dm'] ?? null) ? $in['dm'] : [], 0, 5) as $m) {
    if (!is_array($m) || !preg_match('/^[0-9a-f]{12}$/', (string)($m['to'] ?? ''))) continue;
    $t = mb_substr(trim(preg_replace('/[\x00-\x1F<>]/u', '', (string)($m['t'] ?? ''))), 0, 200);
    if ($t !== '') $ins->execute([$m['to'], $st['pid'], $nm, $t, time()]);
  }
  $after = max(0, (int)($in['dmAfter'] ?? 0));
  $q2 = $db->prepare('SELECT id,frm,nm,t,ts FROM dms WHERE too = ? AND id > ? ORDER BY id LIMIT 30');
  $q2->execute([$st['pid'], $after]);
  foreach ($q2 as $r) $dmOut[] = ['id' => (int)$r['id'], 'from' => $r['frm'], 'nm' => $r['nm'], 't' => $r['t'], 'ts' => (int)$r['ts']];
  if (mt_rand(1, 200) === 1) $db->exec('DELETE FROM dms WHERE ts < ' . (time() - 30 * 86400));
}

$peers = [];
$q = $db->prepare('SELECT id,state,xp FROM players WHERE seen > ? AND id <> ? ORDER BY seen DESC LIMIT 60');
$q->execute([time() - 10, $id]);
foreach ($q as $r) { $s = json_decode($r['state'], true) ?: []; $s['xp'] = (int)$r['xp']; $peers[] = ['peer' => substr(hash('sha256', $r['id']), 0, 10), 'presence' => $s]; }
$payOut = [];
if ($st['pid'] !== '') {
  $q3 = $db->prepare('SELECT id,nm,name,amt FROM pay WHERE too = ? ORDER BY id LIMIT 10'); $q3->execute([$st['pid']]);
  $del = $db->prepare('DELETE FROM pay WHERE id = ?');
  foreach ($q3->fetchAll(PDO::FETCH_ASSOC) as $r) { $payOut[] = ['nm' => $r['nm'], 'name' => $r['name'], 'amt' => (int)$r['amt']]; $del->execute([$r['id']]); }
}
$out = ['ok' => true, 'peers' => $peers, 'dm' => $dmOut, 'now' => time(), 'pay' => $payOut];
if (($in['top'] ?? 0)) $out['top'] = top($db);
echo json_encode($out);
