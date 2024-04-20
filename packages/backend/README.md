# Add Olas to your dApp


## set up the backend

Set up a python project inside of our celo-composer. Or your existing dApp. 


```bash
poetry new backend
```

Navigate into the backend folder

```bash
cd backend
```

Set up the environment


```bash
poetry shell
```


Install the mech-client


```bash
poetry add mech-client
```

## Create the private key

Create a file for your private key. 

```bash
mkdir ethereum_private_key.txt
```

Add the private key that you [export form your metamask wallet](https://support.metamask.io/hc/en-us/articles/360015289632-How-to-export-an-account-s-private-key) and add it into the file.

Add the file that you have created to your `.gitignore` so you don't accidentatlly push it


```bash
echo ethereum_private_key.txt >> .gitignore
```

## Call the mech-client

Create Python script my_script.py:

```bash
touch my_script.py
```


Edit my_script.py as follows:

Find all possible tools in the [Olas mech](https://github.com/valory-xyz/mech/tree/main/packages/valory/customs). Just choose one of the folder names.

```python
from mech_client.interact import interact, ConfirmationType

prompt_text = 'Write a Haiku about web3 hackathons'
   agent_id = 2
    tool_name = "openai-gpt-3.5-turbo"
    chain_config = "celo"
    private_key_path="ethereum_private_key.txt"

    result = interact(
        prompt=prompt_text,
        agent_id=agent_id,
        tool=tool_name,
        chain_config=chain_config,
        confirmation_type=ConfirmationType.ON_CHAIN,
        private_key_path=private_key_path
    )
print(result)

```



## Set up your environment varibales

create an `.env` file and add your WWS and RPC provider. We recommend [Quicknode](https://www.quicknode.com/). You can create one free project there

```bash
MECHX_CHAIN_RPC=https://proud-proud-layer.celo-mainnet.quiknode.pro/<your-key>
MECHX_WSS_ENDPOINT=wss://proud-proud-layer.celo-mainnet.quiknode.pro/<your-key>
```

## Error

In case you are running the script I was running into this error

```bash
ModuleNotFoundError: No module named 'pkg_resources'
```

so, I had to install another package but afterwards it worked. So, how I solved it was:

```bash
pip install --upgrade setuptools
```

## Run the script

to run the script just call

```bash
python my_script.py
```

## Set up your python backend with flask

1. Install Flask:
If you haven't already, you'll need to install Flask. You can do this via pip:

```bash
pip install Flask
```

```bash
pip install flask-cors
```


2. Prepare our python script.

We will have to update our script a bit now to be able to call it, so let's wrap the code in a proper function.

```python
# my_script.py
from mech_client.interact import interact, ConfirmationType


def get_prompt(prompt_text):
    agent_id = 2
    tool_name = "openai-gpt-3.5-turbo"
    chain_config = "celo"
    private_key_path="ethereum_private_key.txt"

    result = interact(
        prompt=prompt_text,
        agent_id=agent_id,
        tool=tool_name,
        chain_config=chain_config,
        confirmation_type=ConfirmationType.ON_CHAIN,
        private_key_path=private_key_path
    )
    print(result)
```

3. set up your app
Create a new python file to set up your app


```bash
touch app.py
```

add this code to set up the app

```python
# app.py
from flask import Flask, jsonify, request
from my_script import get_haiku
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS if needed, especially for local development with frontend

@app.route('/get-prompt', methods=['GET'])
def getChatGPTRequest():
    prompt = request.args.get('prompt', 'Write a Haiku about web3 hackathons?')  # Default prompt
    try:
        response = get_prompt(prompt)
        return jsonify({"success": True, "response": response}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)


```


## Make the backend call in your frontend


Inside of your `pages\api` folder create a file to get your backened request.

```bash
touch get-data.ts
```

Add this code to set up the API route

```typescript
// pages/api/get-prompt.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const prompt = req.query.prompt; // Access the prompt sent from the frontend
  try {
    const { data } = await axios.get(`http://127.0.0.1:5000/get-prompt?prompt=${prompt}`);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
```


Now let's add the query call into our `index.tsx` file.


```typescript
  const [yourPrompt, setYourPrompt] = useState('');
  const [response, setResponse] = useState<ResponseData | null>(null);

  async function fetchPromptData(prompt: string): Promise<ResponseData> {
        const response = await fetch(`/api/get-prompt?prompt=${encodeURIComponent(prompt)}`);
        console.log(response);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }

    // Define useMutation with proper typing
    const { mutate, data, error } = useMutation({
        mutationFn: fetchPromptData
    });

```

and this code below all the `useEffect` hooks

```typescript
  const handleFetchClick = () => {
        if (yourPrompt) {
            mutate(yourPrompt, {
                onSuccess: (data) => {
                    console.log(data);
                    
                    console.log('Data fetched successfully:', data);
                },
                onError: (error: Error) => {
                    console.error('Error fetching data:', error.message);
                }
            });
        }
    };
```

add some elements to trigger the call and showcase the data

```typescript
 return (
        <div className="flex flex-col justify-center items-center">
            <div className="h1">
                There you go... a canvas for your next Celo project!
            </div>
            {isConnected ? (
                <div className="h2 text-center">
                    Your address: {userAddress}

                    <br />
                    <p>Input your prompt</p>
                    <input
                        type="text"
                        value={yourPrompt}
                        onChange={(event) => setYourPrompt(event.target.value)} // Attach the event handler to the input's onChange event
                    />

                    <br />
                    <button onClick={handleFetchClick} disabled={!yourPrompt}>
                        Fetch Prompt
                    </button>
                    {data && (<p>

                        // to work on to get the right data type and right p

                        Haiku: {response?.result || ""}
                    </p>)}

                </div>
            ) : (
                <div>No Wallet Connected</div>
            )}
        </div>
    );
```


Add the interface of the response data above the component

```typescript
interface ResponseData {
    requestId: bigint;
    result: string;
    prompt: string;
    cost_dict: Record<string, unknown>; // If the cost_dict structure is known, replace 'unknown' with that structure
    metadata: {
      model: null | string; // Use 'string' if model can have string values aside from 'null'
      tool: string;
    };
  }
```




