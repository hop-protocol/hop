docker-start:
	docker run -p 3000:3000 hopprotocol/explorer-backend

# Build docker target
docker-build:
	(cd ../../ && docker build --build-arg=GIT_REV=$$(git rev-parse --short HEAD) -f ./packages/explorer-backend/Dockerfile -t hopprotocol/explorer-backend .)

# Tag docker image
docker-tag:
	$(eval REV=$(shell git rev-parse HEAD | cut -c1-7))
	docker tag hopprotocol/explorer-backend:latest hopprotocol/explorer-backend:latest
	docker tag hopprotocol/explorer-backend:latest hopprotocol/explorer-backend:$(REV)

# Push to registry
docker-push:
	$(eval REV=$(shell git rev-parse HEAD | cut -c1-7))
	docker push hopprotocol/explorer-backend:latest
	docker push hopprotocol/explorer-backend:$(REV)

# Build docker image and push to AWS registry
docker-build-and-push: docker-build docker-tag docker-push
