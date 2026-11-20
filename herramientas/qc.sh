#!/usr/bin/env bash
# Control de calidad técnico de un MP4 final (Directiva 2.0, §11).
# Uso: bash herramientas/qc.sh salida/P01-xxx.mp4 [--borrador]
set -uo pipefail
f="$1"; borrador="${2:-}"
ok=0; fallo() { echo "  ✗ $1"; ok=1; }; bien() { echo "  ✓ $1"; }

v=$(ffprobe -v error -select_streams v:0 -show_entries stream=codec_name,width,height,r_frame_rate,pix_fmt -of default=nw=1 "$f")
a=$(ffprobe -v error -select_streams a:0 -show_entries stream=codec_name,sample_rate -of default=nw=1 "$f")
dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f")
codec=$(grep codec_name <<<"$v" | cut -d= -f2); w=$(grep width <<<"$v" | cut -d= -f2); h=$(grep height <<<"$v" | cut -d= -f2)
fps=$(grep r_frame_rate <<<"$v" | cut -d= -f2); pix=$(grep pix_fmt <<<"$v" | cut -d= -f2)

[[ "$codec" == "h264" ]] && bien "Códec H.264" || fallo "Códec $codec (se espera h264)"
if [[ "$borrador" == "--borrador" ]]; then bien "Resolución ${w}×${h} (borrador)";
else [[ "$w" == "1080" && "$h" == "1920" ]] && bien "Resolución 1080×1920" || fallo "Resolución ${w}×${h}"; fi
[[ "$fps" == "30/1" ]] && bien "30 fps" || fallo "fps $fps"
[[ "$pix" == "yuv420p" ]] && bien "yuv420p (compatible con redes)" || fallo "pix_fmt $pix"
[[ -n "$a" ]] && bien "Pista de audio presente" || fallo "Sin audio"
awk -v d="$dur" 'BEGIN{exit !(d>=10 && d<=90)}' && bien "Duración ${dur%.*} s" || fallo "Duración fuera de rango: $dur s"
br=$(ffprobe -v error -show_entries format=bit_rate -of csv=p=0 "$f"); awk -v b="$br" 'BEGIN{exit !(b<=14000000)}' && bien "Bitrate $((br/1000)) kbps (≤ 14 Mbps)" || fallo "Bitrate $((br/1000)) kbps (> 14 Mbps)"

loud=$(ffmpeg -hide_banner -nostats -i "$f" -af ebur128=peak=true -f null - 2>&1 | awk '/Integrated loudness/{f=1} f&&/I:/{print $2; exit}')
peak=$(ffmpeg -hide_banner -nostats -i "$f" -af ebur128=peak=true -f null - 2>&1 | awk '/True peak/{f=1} f&&/Peak:/{print $2; exit}')
awk -v l="$loud" 'BEGIN{exit !(l>=-18 && l<=-12)}' && bien "Sonoridad ${loud} LUFS (objetivo −16 ±2)" || fallo "Sonoridad ${loud} LUFS (objetivo −16 ±2)"
awk -v p="$peak" 'BEGIN{exit !(p<=-0.5)}' && bien "Pico real ${peak} dBTP" || fallo "Pico real ${peak} dBTP (> −0.5)"

# fotogramas negros o congelados prolongados
negro=$(ffmpeg -hide_banner -nostats -i "$f" -vf "blackdetect=d=0.5:pic_th=0.98" -an -f null - 2>&1 | grep -c black_start)
[[ "$negro" == "0" ]] && bien "Sin tramos negros" || fallo "$negro tramos negros > 0,5 s"
congelado=$(ffmpeg -hide_banner -nostats -i "$f" -vf "freezedetect=n=0.001:d=3" -an -f null - 2>&1 | grep -c freeze_start)
[[ "$congelado" == "0" ]] && bien "Sin imagen congelada > 3 s" || fallo "$congelado tramos de imagen congelada > 3 s"

echo "  tamaño: $(du -h "$f" | cut -f1)"
exit $ok
