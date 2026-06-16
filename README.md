# Installation

Before running any commands, run the following to install all npm dependencies required for this package to work:

```
./execute npm install
```

# Start Storybook

```
./execute storybook
```

# Release to npm

Releases go through `./execute release`, which runs `release-it` inside a Docker container (semantic version bump → build → publish → git tag).

The publish step needs an npm token in `.npmrc` at the repo root — `./execute release` mounts it into the container at `/root/.npmrc`. The file is gitignored, so the token never reaches the repo.

```
//registry.npmjs.org/:_authToken=<your-npm-token>
legacy-peer-deps=true
```

The token must be a **granular access token** with **"Bypass two-factor authentication"** enabled (regular tokens get a 403 when 2FA is on the account). Create one at https://www.npmjs.com/settings/<your-user>/tokens — scope it to `@teachfloor/extension-kit` (or the whole `@teachfloor` scope), paste it into `.npmrc`, then:

```
./execute release
```