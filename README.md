# SYNTAXX — Jonathan Imalsh Portfolio

A one-page React + Vite portfolio with a Three.js animated hero, GSAP scroll reveals, responsive layouts and custom CSS.

## Run locally

1. Install Node.js (LTS) if it is not already installed.
2. Open this folder in VS Code.
3. In the VS Code terminal, run:

   ```bash
   npm install
   npm run dev
   ```

4. Open the local URL printed by Vite (usually http://localhost:5173/).

## Production build

```bash
npm run build
npm run preview
```

## Notes

- Main page content: `src/App.jsx`
- Visual styling and responsive layout: `src/style.css`
- Page metadata: `index.html`
- The portrait-style monogram is an intentional graphic treatment, not a photo placeholder.
- Contact details and external social profile URLs have not been invented or hardcoded.
- The Three.js scene uses a capped pixel ratio and cleans up its resources when unmounted.
