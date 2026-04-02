Add your three MP3 files here (exact names):

  casino-dealt.mp3   — long deal ambience (only ~0.3s plays per card)
  casino-win.mp3     — hand win (plays up to ~14s, then fades)
  casino-chips.mp3   — placing chips, pushes, side-bet wins
                       (clips are taken from 2s–5s in the file; edit
                       CHIPS_REGION_* in tableAudio.js if yours differs)

To use different filenames, edit TABLE_SOUND_FILES in:
  src/Game/components/Services/tableAudio.js

If the best part of casino-dealt is after the first few seconds, increase
DEAL_SAMPLE_WINDOW_SEC in that same file.
