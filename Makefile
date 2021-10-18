server:
	python -m http.server --bind 0.0.0.0 3000

lint:
	standard --fix mainnet/main.js

deploy:
	netlify deploy --prod
