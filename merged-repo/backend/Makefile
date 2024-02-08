docker:
	docker run -p 3000:3000 hopprotocol/explorer-backend

# Build docker target
docker-build:
	docker build -f Dockerfile -t hopprotocol/explorer-backend .

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

curl-request-transfers:
	curl http://localhost:8000/v1/transfers?transferId=0xbe6953dac8149e3f4d3a5719445170fb9835c461a980cbdaf9ad5cce10c9d27c

curl-request-accounts:
	curl "http://localhost:8000/v1/accounts?startTimestamp=1670563686&endTimestamp=1670567286"
	#curl "https://explorer-api.hop.exchange/v1/accounts?startTimestamp=1670563686&endTimestamp=1670567286&perPage=5&page=1"
	#curl "http://localhost:8000/v1/accounts?startDate=2022-12-06&endDate=2022-12-07"
