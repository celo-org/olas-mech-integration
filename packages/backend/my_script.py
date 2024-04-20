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