# Build docker target
docker-build:
	(cd ../../ && docker build --build-arg=GIT_REV=$$(git rev-parse --short HEAD) -f ./packages/v2-explorer-backend/Dockerfile -t hopprotocol/v2-explorer-backend .)

# Tag docker image with latest
docker-image-tag-latest:
	docker tag hopprotocol/v2-explorer-backend:latest hopprotocol/v2-explorer-backend:latest

# Tag docker image
docker-image-tag:
	$(eval REV=$(shell git rev-parse HEAD | cut -c1-7))
	$(eval BRANCH=$(shell git branch --show-current))
	docker tag hopprotocol/v2-explorer-backend:latest hopprotocol/v2-explorer-backend:$(REV)
	docker tag hopprotocol/v2-explorer-backend:latest hopprotocol/v2-explorer-backend:$(BRANCH)

# Push to registry
docker-registry-push:
	$(eval REV=$(shell git rev-parse HEAD | cut -c1-7))
	$(eval BRANCH=$(shell git branch --show-current))
	docker push hopprotocol/v2-explorer-backend:latest
	docker push hopprotocol/v2-explorer-backend:$(REV)
	docker push hopprotocol/v2-explorer-backend:$(BRANCH)

# Build docker image and push to registry
docker-build-and-push: docker-build docker-image-tag docker-registry-push

# Tag docker and push to registry
docker-tag-and-push: docker-image-tag docker-registry-push

docker-start:
	docker run --env-file .env hopprotocol/v2-explorer-backend

