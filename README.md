# Beauty & Vintage – B2B website

Static, bilingual (Greek / English) company site for wholesale partners, hosted on GitHub Pages.
The retail e-shop lives at <https://beautyandvintage.com/>; this site does **not** sell to consumers.

## Structure

```
index.html           single-page site (all content, both languages)
404.html             not-found page
assets/css/style.css styles – palette & fonts mirror the e-shop
assets/js/main.js    language switch, mobile menu, login notice, inquiry form
assets/img/          logo, favicon, product & lifestyle photos
.nojekyll            serve files as-is (no Jekyll build)
```

## Editing content

Every visible text exists twice, side by side:

```html
<span lang="en">Our range</span><span lang="el">Προϊόντα</span>
```

Only the active language is shown. Edit both when changing copy.
`?lang=el` or `?lang=en` in the URL forces a language; otherwise the visitor's last choice or browser language is used.

## Login notice

There are no customer accounts. The **Login** button opens a sign-in form; any submission (nothing is sent anywhere)
shows a notice that Beauty & Vintage sells B2B only and points the visitor to a retailer.
Linking to `https://<site>/#login` opens the dialog directly.

## Wholesale inquiry form

GitHub Pages has no server, so the form opens the visitor's email app with a pre-filled message to
`info@beautyandvintage.com`. To receive submissions without relying on the visitor's mail app, connect a form
service (e.g. Formspree) and replace the `submit` handler in `assets/js/main.js` with a `fetch` to that endpoint.

## Deploying

1. Push this folder to a GitHub repository named `beautyandvintage.github.io` (under the `beautyandvintage` account/org),
   or any repo name for a project site.
2. In **Settings → Pages**, choose *Deploy from a branch*, branch `main`, folder `/ (root)`.
3. Optional custom domain (e.g. `b2b.beautyandvintage.com`): add it in **Settings → Pages → Custom domain** and create a
   `CNAME` DNS record pointing to `beautyandvintage.github.io`.

Preview locally with `python -m http.server` and open <http://localhost:8000>.
