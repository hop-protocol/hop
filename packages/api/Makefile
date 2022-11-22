# Build docker target
docker-build:
	npm run build
	docker build -f Dockerfile -t hopprotocol/hop-api .

# Tag docker image with latest
docker-image-tag-latest:
	docker tag hopprotocol/hop-api:latest hopprotocol/hop-api:latest

# Tag docker image
docker-image-tag:
	$(eval REV=$(shell git rev-parse HEAD | cut -c1-7))
	$(eval BRANCH=$(shell git branch --show-current))
	docker tag hopprotocol/hop-api:latest hopprotocol/hop-api:$(REV)
	#docker tag hopprotocol/hop-api:latest hopprotocol/hop-api:$(BRANCH)

# Push to registry
docker-registry-push:
	$(eval REV=$(shell git rev-parse HEAD | cut -c1-7))
	$(eval BRANCH=$(shell git branch --show-current))
	docker push hopprotocol/hop-api:latest
	docker push hopprotocol/hop-api:$(REV)
	#docker push hopprotocol/hop-api:$(BRANCH)

# Build docker image and push to registry
docker-build-and-push: docker-build docker-image-tag docker-registry-push

# Tag docker and push to registry
docker-tag-and-push: docker-image-tag docker-registry-push

docker-start:
	docker run --env-file .env hopprotocol/hop-api

curl-quote:
	curl "http://localhost:8000/v1/quote?amount=1000000&token=USDC&fromChain=polygon&toChain=gnosis&slippage=0.5"

curl-transfer-status:
	curl "http://localhost:8000/v1/transfer-status?transferId=0x5a15b2abd4d0f2e5d0ea3d5fc93758374b14940096487d70f7c95b5393fc9c89"
