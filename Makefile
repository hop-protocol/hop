lint:
	standard --fix mainnet/main.js

deploy:
	netlify deploy --prod
