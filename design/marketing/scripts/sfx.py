"""Shared sound-effect toolkit for the marketing videos (sound effects only, no music).

The notification sound is an original synthesized chime in the style of a phone alert
(three quick glassy notes + a vibration buzz); it is not Apple's sound file.
"""
import wave
from pathlib import Path

import numpy as np

SR = 44100


def load(path):
    with wave.open(str(path)) as w:
        data = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32)
    return data / 32768.0


def save(path, data):
    data = np.clip(data, -1, 1)
    with wave.open(str(path), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((data * 32767).astype(np.int16).tobytes())


def bell(freq, length, decay):
    t = np.arange(int(SR * length)) / SR
    env = np.exp(-t * decay) * np.minimum(1, t / 0.003)
    tone = (np.sin(2 * np.pi * freq * t)
            + 0.35 * np.sin(2 * np.pi * freq * 2.76 * t) * np.exp(-t * decay * 2)
            + 0.15 * np.sin(2 * np.pi * freq * 5.4 * t) * np.exp(-t * decay * 4))
    return tone * env


def marimba(freq, length, decay):
    """Marimba bar: fundamental, the bar's 3.93x and 9.2x partials (fading fast), mallet click."""
    t = np.arange(int(SR * length)) / SR
    env = np.exp(-t * decay) * np.minimum(1, t / 0.0015)
    tone = (np.sin(2 * np.pi * freq * t)
            + 0.30 * np.sin(2 * np.pi * freq * 3.93 * t) * np.exp(-t * decay * 4)
            + 0.08 * np.sin(2 * np.pi * freq * 9.2 * t) * np.exp(-t * decay * 9))
    click = np.random.default_rng(1).uniform(-1, 1, len(t)) * np.exp(-t * 900) * 0.15
    return tone * env + click


def room(x, amount=0.18):
    """Tiny room echo, like a phone speaker in a room."""
    out = x.copy()
    for delay, g in ((0.031, 0.5), (0.047, 0.35), (0.071, 0.22), (0.11, 0.12)):
        d = int(SR * delay)
        out[d:] += x[:-d] * g * amount / 0.18
    return out


def notif_chime():
    """Classic phone text-alert feel: three quick marimba notes, tonic → fifth → octave
    (a generic pattern, synthesized here; not Apple's sound file)."""
    out = np.zeros(int(SR * 0.9))
    for start, f, length, decay in ((0.0, 880.0, 0.5, 9), (0.105, 1318.5, 0.5, 9), (0.21, 1760.0, 0.68, 6)):
        s0 = int(SR * start)
        b = marimba(f, length, decay)
        out[s0:s0 + len(b)] += b[: len(out) - s0]
    return room(out) * 0.55


def buzz():
    """Phone vibrating on a table: 170 Hz motor, two short pulses."""
    t = np.arange(int(SR * 0.42)) / SR
    gate = ((t < 0.16) | ((t > 0.24) & (t < 0.40))).astype(float)
    sig = np.sign(np.sin(2 * np.pi * 170 * t)) * 0.5 + np.sin(2 * np.pi * 340 * t) * 0.3
    return sig * gate * 0.18


def pop(freq=520.0):
    """Short UI pop (an element appearing)."""
    t = np.arange(int(SR * 0.12)) / SR
    f = freq * (1 + 0.8 * np.exp(-t * 60))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 38) * 0.5


def tick():
    """Dry tick (an empty slot)."""
    t = np.arange(int(SR * 0.05)) / SR
    rng = np.random.default_rng(7)
    return rng.uniform(-1, 1, len(t)) * np.exp(-t * 120) * 0.35


class Mix:
    def __init__(self, duration, audio_dir):
        self.data = np.zeros(int(SR * duration))
        self.dir = Path(audio_dir)
        self.chime = notif_chime()

    def file(self, name):
        return load(self.dir / name)

    def at(self, t, clip, gain=1.0):
        s = int(SR * t)
        self.data[s:s + len(clip)] += clip[: len(self.data) - s] * gain

    def notif(self, t, gain=1.0):
        self.at(t, buzz(), gain)
        self.at(t + 0.02, self.chime, gain)

    def write(self, name, peak_target=0.89):
        peak = float(np.max(np.abs(self.data)))
        save(self.dir / name, self.data / peak * peak_target)


def crunch(seed=0):
    """One crisp bite: a cluster of short bright noise cracks."""
    rng = np.random.default_rng(seed)
    out = np.zeros(int(SR * 0.22))
    for _ in range(9):
        s = int(rng.uniform(0, 0.14) * SR)
        n = int(SR * rng.uniform(0.006, 0.02))
        t = np.arange(n) / SR
        crack = rng.uniform(-1, 1, n) * np.exp(-t * rng.uniform(150, 300))
        crack = np.diff(np.concatenate([[0], crack]))  # high-pass: brittle, not hissy
        out[s:s + n] += crack[: len(out) - s] * rng.uniform(0.4, 1.0)
    return out * 0.9


def munch(m, t, bites=4, gap=0.32, gain=1.0):
    """The Canap' eating chips: a few bites in a row."""
    for i in range(bites):
        m.at(t + i * gap, crunch(i), gain)
