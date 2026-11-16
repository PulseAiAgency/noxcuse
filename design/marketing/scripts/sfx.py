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


def notif_chime():
    out = np.zeros(int(SR * 0.9))
    for i, f in enumerate([1318.5, 1760.0, 2093.0]):  # E6, A6, C7: quick rising alert
        start = int(SR * i * 0.085)
        b = bell(f, 0.9 - i * 0.085, 7.5) * (0.55 if i < 2 else 0.7)
        out[start:start + len(b)] += b[: len(out) - start]
    return out * 0.6


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
