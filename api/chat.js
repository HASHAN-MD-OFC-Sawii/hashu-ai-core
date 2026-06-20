import { HfInference } from '@huggingface/inference';

const hf = new HfInference();

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message } = req.body;

    try {
        const response = await hf.textGeneration({
            model: 'Qwen/Qwen2.5-72B-Instruct',
            inputs: `<|im_start|>system\nYou are Hashu AI, a hyper-intelligent, elite, and luxury AI assistant created and owned by MR HASHUU. You speak with high authority, deep technical knowledge, and absolute precision. Support both English and Sinhala perfectly.<|im_end|>\n<|im_start|>user\n${message}<|im_end|>\n<|im_start|>assistant\n`,
            parameters: {
                max_new_tokens: 600,
                temperature: 0.7,
                return_full_text: false
            }
        });

        let reply = response.generated_text.trim();
        reply = reply.replace('<|im_end|>', '').trim();

        return res.status(200).json({ reply });
    } catch (error) {
        return res.status(500).json({ error: 'Hashu AI Core Encountered an Internal Anomaly.' });
    }
}
