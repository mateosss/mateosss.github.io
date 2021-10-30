<mateosss.github.io>

List of things that this blog should have:

- [ ] Optimized lighthouse score and minifications
- [x] Full markdown styling
- [x] Home/about/404 pages
- [x] Dark mode
- [x] Favicon and theme metatag
- [ ] Good usage of metatags: see jekyll-seo-tag,
  [jekyll-sitemap](https://jekyllrb.com/docs/step-by-step/10-deployment/) and
  schema.org
- [x] Good code highlighting: use fira code, see prism or some highlighter for
  jekyll
- [ ] Better vertical rythm based on https://nowodzinski.pl/syncope/
- [ ] CSS for print media for nicer pdfs
- [ ] Latex support: see Katex
- [ ] RSS/Atom feed: see jekyll-atom o
  [jekyll-feed](https://jekyllrb.com/docs/step-by-step/10-deployment/)
- [ ] Comments: see https://utteranc.es/ or directly use the [github
  api](https://api.github.com/repos/aristath/aristath.github.com/issues/5/comments?per_page=3)

# Run

```bash
# Install (from https://jekyllrb.com/docs/installation)
sudo apt-get install ruby-full build-essential zlib1g-dev
echo '# Install Ruby Gems to ~/gems' >> ~/.bashrc
echo 'export GEM_HOME="$HOME/gems"' >> ~/.bashrc
echo 'export PATH="$HOME/gems/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
gem install jekyll bundler
bundle install

# Run
bundle exec jekyll serve --host 0.0.0.0
```
