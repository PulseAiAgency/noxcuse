"""Builds the video soundtrack: sound effects only, no music.

The notification sound is an original synthesized chime in the style of a phone alert
(three quick glassy notes + a short vibration buzz); it is not Apple's sound file.
Usage: python3 -I mix_sfx.py <audio_dir>
"""
import sys
import wave
from pathlib import Path

import numpy as np

SR = 44100
DUR = 19.5
audio = Path(sys.argv[1])


def load(name):
    with wave.open(str(audio / name)) as w:
        data = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32)
    return data / 32768.0


def save(name, data):
    data = np.clip(data, -1, 1)
    with wave.open(str(audio / name), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((data * 32767).astype(np.int16).tobytes())


def bell(freq, length, decay):
    t = np.arange(int(SR * length)) / SR
    env = np.exp(-t * decay) * np.minimum(1, t / 0.003)
    # Glassy timbre: fundamental + inharmonic partials that fade faster.
    tone = (np.sin(2 * np.pi * freq * t)
            + 0.35 * np.sin(2 * np.pi * freq * 2.76 * t) * np.exp(-t * decay * 2)
            + 0.15 * np.sin(2 * np.pi * freq * 5.4 * t) * np.exp(-t * decay * 4))
    return tone * env


def notif_chime():
    out = np.zeros(int(SR * 0.9))
    for i, f in enumerate([1318.5, 1760.0, 2093.0]):  # E6, A6, C7: quick rising alert
        start = int(SR * i * 0.085)
        b = bell(f, 0.9 - i * 0.085, 7.5) * (0.55 if i < 2 else 0.7)
        out[start:start + len(b)] += b[: len(out) - start]
    return out * 0.6


def buzz():
    # Phone vibrating on a table: 170 Hz motor, two short pulses.
    t = np.arange(int(SR * 0.42)) / SR
    gate = ((t < 0.16) | ((t > 0.24) & (t < 0.40))).astype(float)
    sig = np.sign(np.sin(2 * np.pi * 170 * t)) * 0.5 + np.sin(2 * np.pi * 340 * t) * 0.3
    return sig * gate * 0.18


chime = notif_chime()
save("notif.wav", chime)
thud, clang, snicker, clap = load("thud.wav"), load("plate-clang.wav"), load("canap-snicker.wav"), load("chalk-clap.wav")

mix = np.zeros(int(SR * DUR))


def at(t, clip, gain=1.0):
    s = int(SR * t)
    mix[s:s + len(clip)] += clip[: len(mix) - s] * gain


for t in (0.35, 2.9, 3.5, 4.1):  # the four notifications landing on the lock screen
    at(t, buzz())
    at(t + 0.02, chime)
at(5.35, thud); at(5.75, thud)          # SK / IP stamps
at(6.1, snicker, 0.9)                     # the Canap' laughs
for i in range(5):                        # plates loading on the bar
    at(10.2 + i * 0.5, clang, 0.8)
at(13.45, thud)                           # PR DE LA TEAM stamp
at(14.35, thud, 1.1); at(14.38, clap, 0.9)  # Canap' crushed, chalk cloud
at(15.9, thud); at(16.25, thud)           # NO / XCUSE stamps
at(17.3, chime, 0.9)                      # CTA: one last notification

peak = np.max(np.abs(mix))
mix = mix / peak * 0.89
save("sfx-mix.wav", mix)
print("peak normalised from", round(float(peak), 2))
