# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [3.0.0](https://github.com/eazyautodelete/eazyautodelete-core/compare/v1.4.0...v3.0.0) (2022-09-02)


### ⚠ BREAKING CHANGES

* **core:** using modules now
* **buttons:** rename Args to CommandArgs

### Features

* **bot:** add activeChannels property ([bebf0cc](https://github.com/eazyautodelete/eazyautodelete-core/commit/bebf0ccc7b38b1baf4a5d481193c5b9726f191b4))
* **buttons:** add CommandButton & ButtonArgs ([d9901cb](https://github.com/eazyautodelete/eazyautodelete-core/commit/d9901cb8a51c463462bea389851a6d34af2d9584))
* **buttons:** add deferupdate to commandbutton ([cb8bb6e](https://github.com/eazyautodelete/eazyautodelete-core/commit/cb8bb6e0ec802d5c498759ea5bb5ef6f8229f8fb))
* **core:** everything new ([1a99646](https://github.com/eazyautodelete/eazyautodelete-core/commit/1a996469b364c144b64e0eec4f09a0df2ec52c23))


### Bug Fixes

* **args:** change args.get return to value ([cf1a8c2](https://github.com/eazyautodelete/eazyautodelete-core/commit/cf1a8c23bea8c98d1309059f647537bbc13a0213))
* **bot:** change activeChannels to IDs onkly ([21f7c13](https://github.com/eazyautodelete/eazyautodelete-core/commit/21f7c13ff0d8696301505368f44b03f0a7b4eec3))
* **bot:** fix translate function ([43dc5d2](https://github.com/eazyautodelete/eazyautodelete-core/commit/43dc5d2b5e0440d553db6726cda8ba02c2bf5cb6))
* **database:** fix loaddata for user: now user id not message id ([6c639b2](https://github.com/eazyautodelete/eazyautodelete-core/commit/6c639b2f01f1b0d09c8a83886fca2cb9c2ce15d8))
* **database:** fix loadData on buttonCommand ([346084e](https://github.com/eazyautodelete/eazyautodelete-core/commit/346084e59a594bb982a0020a44680d6009589252))
* fix some stuff + remove client.bulkDelete ([e0c6274](https://github.com/eazyautodelete/eazyautodelete-core/commit/e0c6274d73c3cd92015e91b1a2d920ab8ad3972b))
* fix something ig ([a7b28b9](https://github.com/eazyautodelete/eazyautodelete-core/commit/a7b28b9f11a076eca17ad63e987e963e9a2f45c4))

## 1.4.0 (2022-06-06)


### Features

* add CommandMessage, Args, ResponseHandler ([e1bb1e7](https://github.com/eazyautodelete/eazyautodelete-core/commit/e1bb1e7e74c7bd8156baa433ea9399f2d7e0ced1))


### Bug Fixes

* **args:** fix return types of args ([3334869](https://github.com/eazyautodelete/eazyautodelete-core/commit/3334869468349ba9566d9ffe14c2c81699cc3740))
* **bot:** fix register events by importing event ([9cbd277](https://github.com/eazyautodelete/eazyautodelete-core/commit/9cbd2774c333c4d59057fae8322e67ab1108bccb))
* **bot:** initialize logger before response handler so it can use logger ([80f2ee0](https://github.com/eazyautodelete/eazyautodelete-core/commit/80f2ee02be9ec5df1f30581c956ac6a6d5e78f5d))
* **command:** fix embed to return new embed every time ([ac51b27](https://github.com/eazyautodelete/eazyautodelete-core/commit/ac51b2796bc573171604576a3a07c9af9961ca3e))
* **commandmessage:** fix translation to return phrase if no translation is found ([42ba7fa](https://github.com/eazyautodelete/eazyautodelete-core/commit/42ba7faaecfa1089ed90466e6ab8565cae2d70cd))
* implement bot utils ([fc82060](https://github.com/eazyautodelete/eazyautodelete-core/commit/fc82060138cda2995250071849c1756affe179c2))
* **types:** fix db handler type in client ([227c859](https://github.com/eazyautodelete/eazyautodelete-core/commit/227c859b4d572b5cf56fdf181bef543d1359eb9b))
* **types:** fix types ([4994f8f](https://github.com/eazyautodelete/eazyautodelete-core/commit/4994f8f59046206b37cb4dc317b322a9657746b0))
