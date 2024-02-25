# @hop-protocol/v2-explorer-backend

> Hop Protocol V2 Explorer Backend

## Development

Install dependencies

```bash
npm install
```

Run worker

```bash
npm start
```

### Github Actions

Run github action build locally with [act](https://github.com/nektos/act):

```sh
(cd ../../ && act --job build-v2-explorer-backend --workflows .github/workflows/hop_v2_explorer_backend.yml --secret-file=.secrets --verbose)
```

`.secrets`

```sh
DOCKER_USER=<username>
DOCKER_PASS=<password>
```


## Test

```bash
npm test
```

## License

[MIT](LICENSE)
