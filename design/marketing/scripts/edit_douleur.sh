#!/usr/bin/env bash
# « 21 h, t'avais prévu la salle »: 3 Kling clips + overlays rendered from video-douleur/index.html.
# Usage: scripts/edit_douleur.sh <clips_dir with c1, c3, c4.mp4> <overlays_dir> <out.mp4>
set -euo pipefail
C=$1; O=$2; OUT=$3
# Kling clips are HLG tagged BT.2020: read them as SDR, composite in RGB, encode tagged BT.709.
SDR="scale=in_color_matrix=bt2020:in_range=tv,format=gbrp"
N="$SDR,fps=30,scale=1080:1920,setsar=1"
zoom() { echo "scale=w='trunc(1080*($1)/2)*2':h='trunc(1920*($1)/2)*2':eval=frame,crop=1080:1920,setsar=1"; }
ffmpeg -y -loglevel error \
  -i "$C/c1.mp4" -i "$C/c3.mp4" -i "$C/c4.mp4" \
  -framerate 30 -i "$O/soir/f%04d.png" -framerate 30 -i "$O/douleur/f%04d.png" -framerate 30 -i "$O/bascule/f%04d.png" \
  -framerate 30 -i "$O/porte/f%04d.png" -framerate 30 -i "$O/barre/f%04d.png" -framerate 30 -i "$O/fin/f%04d.png" \
  -i audio/sfx-douleur.wav \
  -filter_complex "
  [0:v]setpts=1.25*PTS,$N,trim=0:3.2,setpts=PTS-STARTPTS,$(zoom '1+0.025*t')[a0];
  [1:v]$N,trim=1.0:3.4,setpts=PTS-STARTPTS,$(zoom '1.02+0.02*t')[d0];
  [2:v]$N,trim=0:2.8,setpts=PTS-STARTPTS,$(zoom '1.03+0.02*t+0.05*min(1,max(0,(t-1.2)/0.15))')[e0];
  [a0][3:v]overlay=format=gbrp[A]; [4:v]format=gbrp,setsar=1[B]; [5:v]format=gbrp,setsar=1[Cc];
  [d0][6:v]overlay=format=gbrp[D]; [e0][7:v]overlay=format=gbrp[E]; [8:v]format=gbrp,setsar=1[F];
  [A][B][Cc][D][E][F]concat=n=6:v=1:a=0,scale=out_color_matrix=bt709:out_range=tv,format=yuv420p[v]" \
  -map "[v]" -map 9:a -c:v libx264 -crf 18 -pix_fmt yuv420p -colorspace bt709 -color_primaries bt709 -color_trc bt709 -color_range tv -c:a aac -b:a 192k -t 20.8 "$OUT"
