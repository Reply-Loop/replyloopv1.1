import json, wave, numpy as np, sys
cues = json.load(open("src/audio/cues.json"))
def load(p):
    w = wave.open(p); n = w.getnframes(); sr = w.getframerate()
    a = np.frombuffer(w.readframes(n), dtype=np.int16).reshape(-1, 2).astype(np.float32) / 32768
    return a.mean(1), sr
for s in cues["sections"]:
    x, sr = load("public/" + s["file"])
    # low band (<150Hz) energy envelope via FFT-filtered signal in 10ms hops
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1/sr); X[f > 150] = 0
    low = np.fft.irfft(X, len(x)); hop = sr // 100
    env = np.array([np.sqrt(np.mean(low[i:i+hop]**2)) for i in range(0, len(low)-hop, hop)])
    rms = 20*np.log10(np.sqrt(np.mean(x[: int(s['durationInFrames']/30*sr)]**2)) + 1e-9)
    peak = 20*np.log10(np.abs(x).max())
    out = []
    for a in s["accents"]:
        t = a["frame"] / 30; i = int(t * 100)
        win = env[max(0, i-1): i+12].max()          # accent hit (0-120ms)
        ctx = env[max(0, i-60): i+60]                # +-600ms context
        rank = (ctx > win).sum()
        out.append(f'{a["frame"]}{"!" if a["type"]=="big" else ""}:{20*np.log10(win+1e-9):.1f}dB(r{rank})')
    beat_kicks = env.max()
    print(f'{s["id"]:<18} rms {rms:5.1f} dBFS peak {peak:5.1f} | accents low-band level (rank in +-0.6s window, 0=loudest): ' + "  ".join(out))
