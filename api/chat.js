export default async function handler(req, res) {
    // CORS Headers සෙට් කිරීම (බ්‍රවුසර් එකෙන් එන රික්වෙස්ට් බ්ලොක් නොවීම සඳහා)
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
    
    const token = "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";
    const modelUrl = "https://api-inference.huggingface.co/models/Qwen/Qwen2.5-72B-Instruct";

    const prompt = `<|im_start|>system\nYou are Hashu AI, a hyper-intelligent, elite, and luxury AI assistant created and owned by MR HASHUU. You speak with high authority, deep technical knowledge, and absolute precision. Support both English and Sinhala perfectly.<|im_end|>\n<|im_start|>user\n${message}<|im_end|>\n<|im_start|>assistant\n`;

    try {
        const response = await fetch(modelUrl, {
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

        const data = await response.json();

        if (Array.isArray(data) && data[0] && data[0].generated_text) {
            let reply = data[0].generated_text.trim();
            reply = reply.replace('<|im_end|>', '').trim();
            return res.status(200).json({ reply });
        } else if (data.error) {
            return res.status(500).json({ error: data.error });
        } else {
            return res.status(500).json({ error: 'Mainframe calculation layout error.' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Backend failed to connect to Hugging Face.' });
    }
}
