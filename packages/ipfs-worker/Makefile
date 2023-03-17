# Build docker target
docker-build:
	docker build -f Dockerfile -t hopprotocol/ipfs-worker .

# Tag docker image with latest
docker-image-tag-latest:
	docker tag hopprotocol/ipfs-worker:latest hopprotocol/ipfs-worker:latest

# Tag docker image
docker-image-tag:
	$(eval REV=$(shell git rev-parse HEAD | cut -c1-7))
	$(eval BRANCH=$(shell git branch --show-current))
	docker tag hopprotocol/ipfs-worker:latest hopprotocol/ipfs-worker:$(REV)
	docker tag hopprotocol/ipfs-worker:latest hopprotocol/ipfs-worker:$(BRANCH)

# Push to registry
docker-registry-push:
	$(eval REV=$(shell git rev-parse HEAD | cut -c1-7))
	$(eval BRANCH=$(shell git branch --show-current))
	docker push hopprotocol/ipfs-worker:latest
	docker push hopprotocol/ipfs-worker:$(REV)
	docker push hopprotocol/ipfs-worker:$(BRANCH)

# Build docker image and push to registry
docker-build-and-push: docker-build docker-image-tag docker-registry-push

# Tag docker and push to registry
docker-tag-and-push: docker-image-tag docker-registry-push

docker-start:
	docker run --env-file .env hopprotocol/ipfs-worker:latest
