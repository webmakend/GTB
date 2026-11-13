## Procedureel motorgeluid voor Godot 4.3 (GTB Bommel)
##
## Gebruik:
##   1. Voeg een AudioStreamPlayer2D (of AudioStreamPlayer) toe als kind van je auto.
##   2. Hang dit script eraan.
##   3. Zet `car_path` naar je auto-node (CharacterBody2D of RigidBody2D).
##      Het script leest `velocity` (CharacterBody2D) of `linear_velocity` (RigidBody2D).
##   4. Optioneel: roep `set_throttle(0..1)` aan vanuit je auto-script voor gas geven.
##
## Er worden geen audiobestanden gebruikt: het geluid wordt elke frame
## wiskundig opgebouwd uit de ontstekingsfrequentie van een 4-cilinder,
## boventonen, een lage brom (sub-harmonische), uitlaatruis en een
## eenvoudig versnellingsbak-model dat het toerental laat zakken bij opschakelen.
extends AudioStreamPlayer2D

@export var car_path: NodePath
@export_group("Motor")
@export var cylinders: int = 4
@export var idle_rpm: float = 850.0
@export var max_rpm: float = 6800.0
@export var gear_top_speeds: PackedFloat32Array = PackedFloat32Array([90.0, 170.0, 260.0, 360.0, 470.0]) ## px/s per versnelling
@export var shift_drop: float = 0.62 ## toerental na opschakelen (fractie)
@export_group("Klank")
@export var volume: float = 0.35
@export var rumble: float = 0.55 ## lage brom
@export var rasp: float = 0.25 ## scherpte / uitlaatgerasp
@export var noise_amount: float = 0.06 ## lucht- en uitlaatruis
@export var sample_rate: float = 22050.0

var _car: Node = null
var _playback: AudioStreamGeneratorPlayback
var _phase: float = 0.0
var _sub_phase: float = 0.0
var _rpm: float = 0.0
var _rpm_smooth: float = 0.0
var _throttle: float = 0.0
var _throttle_smooth: float = 0.0
var _gear: int = 0
var _lp_noise: float = 0.0
var _lp_out: float = 0.0
var _hp_prev_in: float = 0.0
var _hp_prev_out: float = 0.0
var _rng := RandomNumberGenerator.new()


func _ready() -> void:
	var gen := AudioStreamGenerator.new()
	gen.mix_rate = sample_rate
	gen.buffer_length = 0.1 # 100 ms: laag genoeg voor directe respons, hoog genoeg tegen haperen
	stream = gen
	_rpm = idle_rpm
	_rpm_smooth = idle_rpm
	if car_path != NodePath():
		_car = get_node_or_null(car_path)
	if _car == null:
		_car = get_parent()
	play()
	_playback = get_stream_playback()


## Vanuit het auto-script aanroepen: 0 = gas los, 1 = vol gas.
func set_throttle(t: float) -> void:
	_throttle = clampf(t, 0.0, 1.0)


func _get_speed() -> float:
	if _car == null:
		return 0.0
	if "velocity" in _car:
		return (_car.velocity as Vector2).length()
	if "linear_velocity" in _car:
		return (_car.linear_velocity as Vector2).length()
	return 0.0


func _update_rpm(delta: float) -> void:
	var speed := _get_speed()
	# Versnelling kiezen op basis van snelheid (simpel automatisch model)
	var g := 0
	while g < gear_top_speeds.size() - 1 and speed > gear_top_speeds[g] * 0.92:
		g += 1
	var lo := 0.0 if g == 0 else gear_top_speeds[g - 1] * 0.92
	var hi := gear_top_speeds[g]
	var ratio := clampf((speed - lo) / maxf(1.0, hi - lo), 0.0, 1.0)
	var base := 0.0 if g == 0 else shift_drop
	var target := lerpf(idle_rpm, max_rpm, base + (1.0 - base) * ratio)
	if speed < 4.0:
		target = idle_rpm + (max_rpm * 0.35 - idle_rpm) * _throttle # stationair toeren
	if g != _gear:
		_gear = g # bij schakelen springt het toerental mee via target
	_rpm = target
	# Toerental en gas vloeiend volgen (motor heeft massa)
	_rpm_smooth = lerpf(_rpm_smooth, _rpm, 1.0 - exp(-delta * 9.0))
	_throttle_smooth = lerpf(_throttle_smooth, _throttle, 1.0 - exp(-delta * 12.0))


func _process(delta: float) -> void:
	if _playback == null:
		return
	_update_rpm(delta)
	var frames := _playback.get_frames_available()
	if frames <= 0:
		return

	# Ontstekingsfrequentie: (rpm / 60) * (cilinders / 2) voor een viertakt
	var fire_hz := (_rpm_smooth / 60.0) * (cylinders / 2.0)
	var inc := fire_hz / sample_rate
	var sub_inc := inc * 0.5 # halve frequentie = de diepe "brom"
	var eng_load := 0.45 + 0.55 * _throttle_smooth
	var rpm_n := clampf((_rpm_smooth - idle_rpm) / (max_rpm - idle_rpm), 0.0, 1.0)
	# Lowpass gaat open bij hoger toerental en meer gas
	var lp_coef := clampf(0.08 + rpm_n * 0.35 + _throttle_smooth * 0.15, 0.05, 0.75)
	var amp := volume * (0.55 + 0.45 * eng_load)

	for i in frames:
		_phase = fmod(_phase + inc, 1.0)
		_sub_phase = fmod(_sub_phase + sub_inc, 1.0)
		var p := _phase * TAU
		# Grondtoon + boventonen (zaagtand-achtig, maar zacht)
		var s := sin(p) * 0.6 + sin(p * 2.0) * 0.28 + sin(p * 3.0) * 0.16 * (0.5 + rasp) + sin(p * 4.0) * 0.08 * rasp
		# Pulserende "knal" per ontsteking: korte piek aan het begin van elke cyclus
		var pulse := exp(-_phase * 9.0) * (0.35 + 0.65 * eng_load)
		s += (pulse - 0.12) * (0.8 + rasp)
		# Lage brom (sub-harmonische) — maakt het een "dikke" motor
		s += sin(_sub_phase * TAU) * rumble * (0.7 + 0.3 * (1.0 - rpm_n))
		# Uitlaat-/inlaatruis, gemoduleerd door de ontstekingspuls
		_lp_noise += (_rng.randf_range(-1.0, 1.0) - _lp_noise) * 0.35
		s += _lp_noise * noise_amount * (0.4 + pulse * 2.0) * (0.5 + _throttle_smooth)
		# Lowpass (één pool) voor warmte
		_lp_out += (s - _lp_out) * lp_coef
		# Highpass tegen DC-offset
		var hp := 0.995 * (_hp_prev_out + _lp_out - _hp_prev_in)
		_hp_prev_in = _lp_out
		_hp_prev_out = hp
		# Zachte begrenzing (soft clip) zodat het niet kraakt
		var v := tanh(hp * 1.6) * amp
		_playback.push_frame(Vector2(v, v))
