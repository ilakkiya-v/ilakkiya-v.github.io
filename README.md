# Ilakkiya Vijayakumar — Portfolio

A multi-page static site (plain HTML, CSS, and JS; no build step).

```
index.html          home: hero, about, core skills, breaking barriers
experience.html     experience
projects.html       projects
achievements.html   achievements and photo gallery
skills.html         skills, certifications, education
community.html      community
contact.html        contact + capture-the-flag
styles.css      dark theme and layout
script.js       menu, Dark/Pink theme, code rain, cursor, reveal, terminal, CTF
assets/         photos and Ilakkiya_Vijayakumar_Resume_updated.pdf (the résumé download)
404.html        custom "access denied" page GitHub Pages shows for broken links
robots.txt      search-engine rules (also hides flag piece 3/3)
.nojekyll       tells GitHub Pages to serve files as-is
.gitignore      keeps portfolio-brief.md, Profile.pdf and .DS_Store out of the repo
```

The header and footer are repeated in every page: if you change a nav link, change it in all 7 files.

## Preview locally

```bash
cd ~/Documents/resume/portfolio
python3 -m http.server 8000
```

Then open http://localhost:8000. Press Ctrl+C to stop.
(Double-clicking `index.html` also works.)

## Updating the résumé

The "Download résumé" button on the home page links to
`assets/Ilakkiya_Vijayakumar_Resume_updated.pdf`. To swap it, replace that file
(or change the link in index.html). Keep phone numbers out of any PDF you publish.
The old `assets/resume.pdf` is listed in .gitignore so it is never published.

## Publish on GitHub Pages

1. Sign in at https://github.com and click **New repository**.
2. Name it `ilakkiya-v.github.io` (this gives you the URL `https://ilakkiya-v.github.io`).
   Set it to **Public** and leave every "Initialize" box unticked. Click **Create repository**.
3. In Terminal:

   ```bash
   cd ~/Documents/resume/portfolio
   git init -b main
   git add .
   git commit -m "Initial portfolio"
   git remote add origin https://github.com/ilakkiya-v/ilakkiya-v.github.io.git
   git push -u origin main
   ```

   If asked for a password, use a GitHub personal access token or sign in through
   the GitHub CLI (`gh auth login`), not your account password.
4. On GitHub, open the repo, then go to **Settings → Pages**.
   Under **Build and deployment**, set Source to **Deploy from a branch**, Branch to **main**, folder **/ (root)**, then **Save**.
5. Wait 1–2 minutes and visit `https://ilakkiya-v.github.io`.

To update later: edit files, then `git add . && git commit -m "Update" && git push`.

## Hidden flag

The site hides a CTF flag in 3 pieces (HTML comment in index.html, browser console
via script.js, and robots.txt). To change it, update all 3 pieces and set FLAG_HASH
in script.js to the output of `printf '%s' 'flag{...}' | shasum -a 256`.
