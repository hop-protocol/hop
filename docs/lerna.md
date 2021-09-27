# Lerna / Yarn Workspaces

## Lerna

link package dependencies according to workspace config

link local packages together and install remaining package dependencies

    $ lerna bootstrap

1. `npm install` all external deps of each pkg
2. symlink all lerna `packages` that are dependencies of each other
3. `npm run prepublish` in all bootstrapped pkgs
4. `npm run prepare` in all bootstrapped pkgs

Add a dependency to matched packages:

    $ lerna add <package>[@version] [--dev] [--exact] [--peer]

Execute any arbitrary command and run it over all of the different packages

note: double dash req to forward flags:

    $ lerna exec COMMAND

Run npm script:

    $ lerna run COMMAND

note: double dash req to forward flags:

Remove all `node_modules` from packages:

    $ lerna clean

List local packages that have changed since the last tagged release ([docs](https://github.com/lerna/lerna/blob/master/commands/changed/README.md)):

    $ lerna changed

The output of lerna changed is a list of packages that would be the subjects of the next `lerna version` or `lerna publish` execution.

