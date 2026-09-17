# UFS Alumni Talk — Ryan Simons

A clickable, deck-style presentation for students at the University of the Free State:
how I got from a UFS degree to working as a Software Engineer at Nedap in the Netherlands.

**Live site:** https://ryansimons.github.io/ufs-presentation

---

## Running it

Double-click `index.html`. That's it — no install, no dev server, no build step.
It's plain HTML, CSS and JavaScript with zero dependencies and zero external requests,
so it works offline and loads instantly on bad lecture-hall wifi.

## Presenting

| Key | Does |
| --- | --- |
| `→` `↓` `Space` `PageDown` | Next step |
| `←` `↑` `PageUp` | Previous step |
| `Home` / `End` | First / last step |
| `1` `2` `3` `4` | Jump to a chapter |
| `T` | Toggle dark / light |

Swipe left and right on a phone. The URL updates as you go (`#work-nedap`), so if the
browser reloads mid-talk you land back on the same step — and you can link anyone
straight to one step.

`Cmd/Ctrl + P` prints every step in order as a handout PDF.

---

## Keeping the timeline current

The timeline on step 3 is a real Gantt chart, not a set of hand-drawn bars. Months are
counted from **January 2020 = 0**, `--tl-span` on the `<ol class="tl">` is the width of the
whole axis in months, and each bar carries `--from` / `--to`:

```html
<ol class="tl" style="--tl-span: 80">          <!-- Jan 2020 → Sep 2026 -->
  <div class="tl__bar tl__bar--4" style="--from: 44; --to: 80"></div>
```

End months are inclusive, which is why Feb→Jul reads as 6 months. Gridlines and the year
labels derive from `--tl-span`, so they stay aligned on their own.

**This goes stale as time passes.** Roughly once a year, bump `--tl-span` and the Nedap
bar's `--to` by 12, add the next `<span style="--at: ...">` year label, and update the two
places that say *3 years* (the timeline row and the Nedap step).

Optional: the step **"How each job actually found me"** (`id="step-work-pattern"` in
`index.html`) is a summary slide — delete the whole `<section>` if you'd rather just say it.

## Editing the content

All of the words live in `index.html`, one `<section class="step">` per step, in the order
they're presented. Edit the text directly — there's no templating and nothing to recompile.

Adding a step is just adding another `<section class="step" id="..." data-chapter="2">`;
the counter, progress bar and chapter rail pick it up on their own.

To retheme, change the colour tokens at the top of `styles.css` — they're defined once for
light and once for dark.

## The files

```
index.html                  every step, in order — edit the words here
styles.css                  theme tokens, layout, timeline, print styles
app.js                      step navigation, keyboard, swipe, theme toggle
assets/profile.jpg          ← you add this
assets/profile-placeholder.svg
assets/linkedin-qr.svg      QR to linkedin.com/in/ryan-simons1
.github/workflows/deploy.yml
```

## Deploying

Every push to `main` redeploys automatically via GitHub Actions. To redeploy without a
commit, open the **Actions** tab, pick *Deploy to GitHub Pages*, and hit **Run workflow**.
