# Login to AWS registry (must have docker running)
docker-registry-login:
	$$(aws ecr get-login --no-include-email --region us-east-1 --profile=authereum)

# Build docker target
docker-build:
	docker build -f Dockerfile -t authereum/bridge-node .

# Tag docker image
docker-image-tag:
	$(eval REV=$(shell git rev-parse HEAD | cut -c1-7))
	docker tag authereum/bridge-node:latest 874777227511.dkr.ecr.us-east-1.amazonaws.com/authereum/bridge-node:latest
	docker tag authereum/bridge-node:latest 874777227511.dkr.ecr.us-east-1.amazonaws.com/authereum/bridge-node:$(REV)

# Push to registry
docker-registry-push:
	$(eval REV=$(shell git rev-parse HEAD | cut -c1-7))
	docker push 874777227511.dkr.ecr.us-east-1.amazonaws.com/authereum/bridge-node:latest
	docker push 874777227511.dkr.ecr.us-east-1.amazonaws.com/authereum/bridge-node:$(REV)

# Build docker image and push to AWS registry
docker-build-and-push: docker-registry-login docker-build docker-image-tag docker-registry-push
docker-start:
	docker run --env-file .env authereum/bridge-node

arbitrum-validator-setup-docker-build:
	(cd l2_nodes/arbitrum && docker build -f Dockerfile -t arbitrum-validator-setup .)

arbitrum-validator-setup-docker-image-tag:
	docker tag arbitrum-validator-setup:latest 874777227511.dkr.ecr.us-east-1.amazonaws.com/arbitrum-validator-setup:latest

arbitrum-validator-setup-docker-registry-push:
	$(eval REV=$(shell git rev-parse HEAD | cut -c1-7))
	docker push 874777227511.dkr.ecr.us-east-1.amazonaws.com/arbitrum-validator-setup:latest

arbitrum-validator-docker-image-tag:
	docker tag arb-validator:latest 874777227511.dkr.ecr.us-east-1.amazonaws.com/arbitrum-validator:latest

arbitrum-validator-docker-registry-push:
	$(eval REV=$(shell git rev-parse HEAD | cut -c1-7))
	docker push 874777227511.dkr.ecr.us-east-1.amazonaws.com/arbitrum-validator:latest
