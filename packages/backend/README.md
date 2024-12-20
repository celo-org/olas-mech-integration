# Call an AI agent from your Celo dApp

This tutorial will guide you through integrating Olas into your dApp by setting up a backend, configuring the environment, and connecting to the frontend. By the end, you'll have a functional project that utilizes Olas for generating prompts and interacting with blockchain tools.

---

## Prerequisites
Before you start, ensure you have the following installed:
- Python 3.8+
- Node.js and Yarn
- [Poetry](https://python-poetry.org/docs/#installation) (for Python dependency management)
- A MetaMask wallet to export a private key
- A Quicknode account (for RPC and WSS endpoints)

---

## Example Project Setup

Navigate to into `packages/backend` and activate a Poetry shell:

```bash
poetry shell
```

Run the backend application:

```bash
python app.py
```


### Set Up the Environment

1. Configure Private Key
Create a file to store your private key securely:
    ```bash
    touch ethereum_private_key.txt
    ```

2. Export your private key from [MetaMask](https://support.metamask.io/hc/en-us/articles/360015289632-How-to-export-an-account-s-private-key) and save it in `ethereum_private_key.txt`.

3. Add the file to your `.gitignore` to prevent accidental uploads:
    ```bash
    echo ethereum_private_key.txt >> .gitignore
    ```

4. Add Environment Variables
Create an `.env` file to store your RPC and WSS endpoints. We recommend using [Quicknode](https://www.quicknode.com/):

```bash
MECHX_CHAIN_RPC=https://proud-proud-layer.celo-mainnet.quiknode.pro/<your-key>
MECHX_WSS_ENDPOINT=wss://proud-proud-layer.celo-mainnet.quiknode.pro/<your-key>
```

### Run the dapp



You can now run the frontend and call the mech agent from there. Navigate to `packages/react-app` and start the development server:

```bash
yarn run dev
```

Your application should now be running locally.

