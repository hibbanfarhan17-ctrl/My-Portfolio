# Portfolio chatbot setup

The chatbot is included on the portfolio pages and uses Puter.js for its AI fallback.

- Questions that match the built-in Hibban portfolio knowledge answer entirely in the browser, including when the visitor is offline.
- Other questions load Puter.js and use the Grok model through Puter.

## No API-key setup required

There is no Netlify function and no API key to add to this project. Puter.js loads only when a visitor asks a question that is not covered by the offline knowledge base.

Puter uses its user-pays model for AI usage, so a visitor may be asked to sign in to Puter before an unmatched question can be answered. The offline Hibban portfolio answers do not need a connection or login.

## Extend offline answers

Edit the `knowledge` array in `app.js`. Each entry has `terms` (keywords and phrases) and a `reply`. This lets you add more questions such as “Who is Hibban?”, “Hibban projects”, “Hibban skills” and “Hibban contact” without needing an internet connection.
