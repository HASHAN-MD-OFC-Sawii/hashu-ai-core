export default async function handler(req, res) {
    // CORS configuration
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    // Token and Endpoint Configurations
    const token = process.env.HF_TOKEN || "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";
    // සර්වර් එක හැමතිස්සෙම 100% වැඩ කරන Meta Llama 3.2 මොඩලය
    const modelUrl = "https://api-inference.huggingface.co/models/meta-llama/Llama-3.2-3B-Instruct";

    // System Prompt Sequence for MR HASHUU
    const prompt = `<|begin_of_text|><|start_header_id|>system<|end_header_id|>\nYou are Hashu AI, a hyper-intelligent, elite, and luxury AI assistant created and owned by MR HASHUU. You speak with high authority, deep technical knowledge, and absolute precision. Support both English and Sinhala perfectly.<|eot_id|><|start_header_id|>user<|end_header_id|>\n${message}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n`;

    try {
        // Direct Native Fetch to Hugging Face
        const hfResponse = await fetch(modelUrl, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                inputs: prompt,
                parameters: {
                    max_new_tokens: 500,
                    temperature: 0.7,
                    return_full_text: false
                }
            })
        });

        const data = await hfResponse.json();

        if (Array.isArray(data) && data[0] && data[0].generated_text) {
            let reply = data[0].generated_text.trim();
            return res.status(200).json({ reply });
        } else if (data.error) {
            return res.status(500).json({ error: `Hugging Face Core Error: ${data.error}` });
        } else {
            return res.status(500).json({ error: 'Unexpected response layout from calculation core.' });
        }

    } catch (error) {
        return res.status(500).json({ error: 'Hashu AI Core Lost Connection to Mainframe.' });
    }
}
