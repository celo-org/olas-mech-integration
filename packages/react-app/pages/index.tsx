import { useMutation, useQuery } from "@tanstack/react-query";
import { log } from "console";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

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

export default function Home() {
    const [userAddress, setUserAddress] = useState("");
    const [isMounted, setIsMounted] = useState(false);
    const [yourPrompt, setYourPrompt] = useState('');
    const [response, setResponse] = useState<ResponseData | null>(null);
    const { address, isConnected } = useAccount();

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


    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isConnected && address) {
            setUserAddress(address);
        }
    }, [address, isConnected]);

    if (!isMounted) {
        return null;
    }



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
}
