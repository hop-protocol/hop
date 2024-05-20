# Build docker target
docker-build:
	(cd ../../ && docker build --build-arg=GIT_REV=$$(git rev-parse --short HEAD) -f ./packages/hop-node/Dockerfile -t hopprotocol/hop-node .)

# Tag docker image with latest
docker-image-tag-latest:
	docker tag hopprotocol/hop-node:latest hopprotocol/hop-node:latest

# Tag docker image
docker-image-tag:
	$(eval REV=$(shell git rev-parse HEAD | cut -c1-7))
	$(eval BRANCH=$(shell git branch --show-current))
	docker tag hopprotocol/hop-node:latest hopprotocol/hop-node:$(REV)
	docker tag hopprotocol/hop-node:latest hopprotocol/hop-node:$(BRANCH)

# Push to registry
docker-registry-push:
	$(eval REV=$(shell git rev-parse HEAD | cut -c1-7))
	$(eval BRANCH=$(shell git branch --show-current))
	docker push hopprotocol/hop-node:latest
	docker push hopprotocol/hop-node:$(REV)
	docker push hopprotocol/hop-node:$(BRANCH)

# Build docker image and push to registry
docker-build-and-push: docker-build docker-image-tag docker-registry-push

# Tag docker and push to registry
docker-tag-and-push: docker-image-tag docker-registry-push

docker-start:
	docker run --env-file .env hopprotocol/hop-node
