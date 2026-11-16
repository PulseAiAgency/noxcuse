"""Soundtrack of « POV : t'as skip la salle » (noxcuse-pov-skip.mp4). Usage: python3 mix_sfx.py <audio_dir>"""
import sys

from sfx import Mix, notif_chime, save

m = Mix(19.5, sys.argv[1])
save(m.dir / "notif.wav", notif_chime())
thud, clang, snicker, clap = (m.file(n) for n in ("thud.wav", "plate-clang.wav", "canap-snicker.wav", "chalk-clap.wav"))
for t in (0.35, 2.9, 3.5, 4.1):  # the four notifications landing on the lock screen
    m.notif(t)
m.at(5.35, thud); m.at(5.75, thud)            # SK / IP stamps
m.at(6.1, snicker, 0.9)                         # the Canap' laughs
for i in range(5):                              # plates loading on the bar
    m.at(10.2 + i * 0.5, clang, 0.8)
m.at(13.45, thud)                               # PR DE LA TEAM stamp
m.at(14.35, thud, 1.1); m.at(14.38, clap, 0.9)  # Canap' crushed, chalk cloud
m.at(15.9, thud); m.at(16.25, thud)             # NO / XCUSE stamps
m.at(17.3, m.chime, 0.9)                        # CTA
m.write("sfx-mix.wav")
