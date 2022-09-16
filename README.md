# KittyKart Smart Contracts [![Github Actions][gha-badge]][gha] [![Hardhat][hardhat-badge]][hardhat] [![License: MIT][license-badge]][license]

[gha]: https://github.com/paulrberg/hardhat-template/actions
[gha-badge]: https://github.com/paulrberg/hardhat-template/actions/workflows/ci.yml/badge.svg
[hardhat]: https://hardhat.org/
[hardhat-badge]: https://img.shields.io/badge/Built%20with-Hardhat-FFDB1C.svg
[license]: https://opensource.org/licenses/MIT
[license-badge]: https://img.shields.io/badge/License-MIT-blue.svg

A Hardhat-based project for KittyKart game, the first P2E game implemented tableland for metadata.

- [Hardhat](https://github.com/nomiclabs/hardhat): compile, run and test smart contracts
- [TypeChain](https://github.com/ethereum-ts/TypeChain): generate TypeScript bindings for smart contracts
- [Ethers](https://github.com/ethers-io/ethers.js/): renowned Ethereum library and wallet implementation
- [Solhint](https://github.com/protofire/solhint): code linter
- [Solcover](https://github.com/sc-forks/solidity-coverage): code coverage
- [Prettier Plugin Solidity](https://github.com/prettier-solidity/prettier-plugin-solidity): code formatter
- [Tableland](https://docs.tableland.xyz/): A decentralized network for relational, composable data

## Features

There are 3 upgradeable smart contracts

- KittyKartGoKart (ERC721A contract relies on Tableland for metadata)
- KittyKartAsset (ERC721A contract relies on Tableland for metadata)
- AutoBodyShop (A smart contract where users can apply assets to the kart, will be deprecated once we build a backend service for shop)

### Sensible Defaults

This template comes with sensible default configurations in the following files:

```text
├── .commitlintrc.yml
├── .editorconfig
├── .eslintignore
├── .eslintrc.yml
├── .gitignore
├── .prettierignore
├── .prettierrc.yml
├── .solcover.js
├── .solhintignore
├── .solhint.json
├── .yarnrc.yml
└── hardhat.config.ts
```

### GitHub Actions

This template comes with GitHub Actions pre-configured. Your contracts will be linted and tested on every push and pull
request made to the `main` branch.

Note though that to make this work, you must se your `INFURA_API_KEY` and your `MNEMONIC` as GitHub secrets.

You can edit the CI script in [.github/workflows/ci.yml](./.github/workflows/ci.yml).

### Conventional Commits

This template enforces the [Conventional Commits](https://www.conventionalcommits.org/) standard for git commit messages.
This is a lightweight convention that creates an explicit commit history, which makes it easier to write automated
tools on top of.

### Git Hooks

This template uses [Husky](https://github.com/typicode/husky) to run automated checks on commit messages, and [Lint Staged](https://github.com/okonet/lint-staged) to automatically format the code with Prettier when making a git commit.

## Usage

### Pre Requisites

Before being able to run any command, you need to create a `.env` file and set a BIP-39 compatible mnemonic as an environment
variable. You can follow the example in `.env.example`. If you don't already have a mnemonic, you can use this [website](https://iancoleman.io/bip39/) to generate one.

Then, proceed with installing dependencies:

```sh
$ yarn install
```

### Compile

Compile the smart contracts with Hardhat:

```sh
$ yarn compile
```

### TypeChain

Compile the smart contracts and generate TypeChain bindings:

```sh
$ yarn typechain
```

### Test

Run the tests with Hardhat:

```sh
$ yarn test
```

### Lint Solidity

Lint the Solidity code:

```sh
$ yarn lint:sol
```

### Lint TypeScript

Lint the TypeScript code:

```sh
$ yarn lint:ts
```

### Coverage

Generate the code coverage report:

```sh
$ yarn coverage
```

### Report Gas

See the gas usage per unit test and average gas per method call:

```sh
$ REPORT_GAS=true yarn test
```

### Clean

Delete the smart contract artifacts, the coverage reports and the Hardhat cache:

```sh
$ yarn clean
```

### Deploy

There are deploy, upgrade and verify hardhat tasks you can use, before running below tasks, you might need to set `DEPLOY_NETWORK` and `TESTING="false"`

```sh
// deploy KittyKartGoKart
$ npx hardhat deploy:KittyKartGoKart

// verify KittyKartGoKart
$ npx hardhat verify:KittyKartGoKart

// upgrade KittyKartGoKart
$ npx hardhat upgrade:KittyKartGoKart

// deploy KittyKartAsset
$ npx hardhat deploy:KittyKartAsset

// verify KittyKartAsset
$ npx hardhat verify:KittyKartAsset

// upgrade KittyKartAsset
$ npx hardhat upgrade:KittyKartAsset

// deploy AutoBodyShop
$ npx hardhat deploy:AutoBodyShop

// verify AutoBodyShop
$ npx hardhat verify:AutoBodyShop

// upgrade AutoBodyShop
$ npx hardhat upgrade:AutoBodyShop

```

### Interactions to deployed smart contracts

There are some hardhat tasks to interact with deployed contracts, before running below tasks, you might need to set `DEPLOY_NETWORK` and `TESTING="false"`

You can find out deployed addresses on `./tasks/deploy/addresses`

```sh
// create tables
$ npx hardhat main:createTables

// intialize state variables
$ npx hardhat main:initContracts

// create metadata table for KittyKartGoKart
$ npx hardhat KittyKartGoKart:createMetadataTable

// get metadata table for KittyKartGoKart
$ npx hardhat KittyKartGoKart:getMetadataTable

// create metadata table for KittyKartAsset
$ npx hardhat KittyKartAsset:createMetadataTable

// get metadata table for KittyKartAsset
$ npx hardhat KittyKartAsset:getMetadataTable

// set game server on KittyKartAsset
$ npx hardhat KittyKartAsset:setGameServer

// set AutoBodyShop on KittyKartAsset
$ npx hardhat KittyKartAsset:setAutoBodyShop

// set asset attribute table for setAssetAttributeTable
$ npx hardhat KittyKartGoKart:setAssetAttributeTable

// set registry on AutoBodyShop
$ npx hardhat AutoBodyShop:setRegistry

// set KittyKartGoKart on AutoBodyShop
$ npx hardhat AutoBodyShop:setKittyKartGoKart

// set setKittyKartAsset on AutoBodyShop
$ npx hardhat AutoBodyShop:setKittyKartAsset

// set assets to the kart
$ npx hardhat AutoBodyShop:applyAsset

```

## Tips

### Syntax Highlighting

If you use VSCode, you can get Solidity syntax highlighting with the [hardhat-solidity](https://marketplace.visualstudio.com/items?itemName=NomicFoundation.hardhat-solidity) extension.

## Using GitPod

[GitPod](https://www.gitpod.io/) is an open-source developer platform for remote development.

To view the coverage report generated by `yarn coverage`, just click `Go Live` from the status bar to turn the server on/off.

## License

[MIT](./LICENSE.md) © Paul Razvan Berg
