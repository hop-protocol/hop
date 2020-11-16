# Login to AWS registry (must have docker running)
.PHONY: docker-registry-login
docker-registry-login:
	$$(aws ecr get-login --no-include-email --region us-east-1 --profile=authereum)

# Build docker target
.PHONY: docker-build
docker-build:
	docker build -f Dockerfile -t authereum/bridge-node .

# Tag docker image
.PHONY: docker-image-tag
docker-image-tag:
	$(eval REV=$(shell git rev-parse HEAD | cut -c1-7))
	docker tag authereum/bridge-node:latest 874777227511.dkr.ecr.us-east-1.amazonaws.com/authereum/bridge-node:latest
	docker tag authereum/bridge-node:latest 874777227511.dkr.ecr.us-east-1.amazonaws.com/authereum/bridge-node:$(REV)

# Push to registry
.PHONY: docker-registry-push
docker-registry-push:
	$(eval REV=$(shell git rev-parse HEAD | cut -c1-7))
	docker push 874777227511.dkr.ecr.us-east-1.amazonaws.com/authereum/bridge-node:latest
	docker push 874777227511.dkr.ecr.us-east-1.amazonaws.com/authereum/bridge-node:$(REV)

# Build docker image and push to AWS registry
.PHONY: docker-build-and-push
docker-build-and-push: docker-registry-login docker-build docker-image-tag docker-registry-push

.PHONY: docker-start
docker-start:
	docker run --env-file .env authereum/bridge-node
