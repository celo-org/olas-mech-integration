# Call an AI agent from your Celo dApp

Learn how to call an AI agent and pay for it in CELO. 

This tutorial is based on the guide for the [Olas mech-client](https://github.com/valory-xyz/mech-client).

This tutorial will guide you through integrating Olas into your dApp by setting up a backend, configuring the environment, and connecting to the frontend. By the end, you'll have a functional project that utilizes the Olas mech for generating prompts and interacting with blockchain tools.


---

## Prerequisites
Before you start, ensure you have the following installed:
- Python 3.8+
- Node.js and Yarn
- [Poetry](https://python-poetry.org/docs/#installation) (for Python dependency management)
- A MetaMask wallet to export a private key
- A Quicknode account (for RPC and WSS endpoints)

---


This example project is built using the [Celo Composer](https://github.com/celo-org/celo-composer). You can do the quickstart by following [this guide](.backend/README.md). 

Follow the guide below to call the mech from any dapp. 

## Add the Agent to an Existing Project

### 1. Set Up the Backend

#### Initialize a Python Project
Inside your dApp's directory, create a new backend folder and set up a Python project:

```bash
poetry new backend
cd backend
```

#### Activate Poetry Environment
Activate the Poetry shell:

```bash
poetry shell
```

#### Install Dependencies
Install the `mech-client` package:

```bash
poetry add mech-client
```

---

### 2. Set Up the Environment

#### Configure Private Key

1. Create a file to store your private key securely:
    ```bash
    touch ethereum_private_key.txt
    ```

2. Export your private key from [MetaMask](https://support.metamask.io/hc/en-us/articles/360015289632-How-to-export-an-account-s-private-key) and save it in `ethereum_private_key.txt`. It should be prefunded with some CELO. This agent will only run on Celo Mainnet.

3. Add the file to your `.gitignore` to prevent accidental uploads:
    ```bash
    echo ethereum_private_key.txt >> .gitignore
    ```

#### Add Environment Variables
Create an `.env` file to store your RPC and WSS endpoints. We recommend using [Quicknode](https://www.quicknode.com/):

```bash
MECHX_CHAIN_RPC=https://proud-proud-layer.celo-mainnet.quiknode.pro/<your-key>
MECHX_WSS_ENDPOINT=wss://proud-proud-layer.celo-mainnet.quiknode.pro/<your-key>
```

---

### 3. Create the Script

#### Write the Python Script
Create a script file:

```bash
touch my_script.py
```

Edit `my_script.py`:

```python
from mech_client.interact import interact, ConfirmationType

def get_prompt(prompt_text):
    agent_id = 2
    tool_name = "openai-gpt-3.5-turbo"  # Replace with your tool
    chain_config = "celo"
    private_key_path = "ethereum_private_key.txt"

    result = interact(
        prompt=prompt_text,
        agent_id=agent_id,
        tool=tool_name,
        chain_config=chain_config,
        confirmation_type=ConfirmationType.ON_CHAIN,
        private_key_path=private_key_path
    )
    return result
```

#### Handle Errors
If you encounter the error:
```bash
ModuleNotFoundError: No module named 'pkg_resources'
```
Resolve it by upgrading `setuptools`:
```bash
pip install --upgrade setuptools
```

#### Run the Script
Execute the script:
```bash
python my_script.py
```

---

### 4. Set Up the API

#### Install Flask
Install Flask and Flask-CORS:
```bash
pip install Flask flask-cors
```

#### Create the API
Create `app.py` and add the following:

```python
from flask import Flask, jsonify, request
from flask_cors import CORS
from my_script import get_prompt

app = Flask(__name__)
CORS(app)

@app.route('/get-prompt', methods=['GET'])
def get_chat_gpt_request():
    prompt = request.args.get('prompt', 'Write a Haiku about web3 hackathons?')
    try:
        response = get_prompt(prompt)
        return jsonify({"success": True, "response": response}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
```

---

## Integrate with the Frontend

### 1. Create an API Route
Inside your Next.js project, create `pages/api/get-prompt.ts`:

```typescript
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const prompt = req.query.prompt;
  try {
    const { data } = await axios.get(`http://127.0.0.1:5000/get-prompt?prompt=${prompt}`);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
```

### 2. Add Functionality
In your React component, define state and handlers:

```typescript
const [yourPrompt, setYourPrompt] = useState('');
const [response, setResponse] = useState<string | null>(null);

async function fetchPromptData(prompt: string) {
  const res = await fetch(`/api/get-prompt?prompt=${encodeURIComponent(prompt)}`);
  const data = await res.json();
  setResponse(data.response);
}

const handleFetchClick = () => {
  if (yourPrompt) fetchPromptData(yourPrompt);
};
```

Add these elements to your component:

```typescript
<div>
  <input
    type="text"
    value={yourPrompt}
    onChange={(e) => setYourPrompt(e.target.value)}
  />
  <button onClick={handleFetchClick}>Fetch Prompt</button>
  {response && <p>Response: {response}</p>}
</div>
```

---

## Next Steps
- **Testing**: Use Postman or `curl` to test your API before frontend integration.
- **Deployment**: Consider hosting your backend using services like Heroku or AWS.
- **Extensions**: Explore more tools available in the [Olas Mech library](https://github.com/valory-xyz/mech/tree/main/packages/valory/customs).

---

Let me know if you'd like more adjustments!