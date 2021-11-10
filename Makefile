serve:
	python -m http.server --bind 0.0.0.0 3000

lint:
	npx standard --fix mainnet/main.js

deploy:
	netlify deploy --prod
