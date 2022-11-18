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
