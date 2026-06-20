import { HfInference } from '@huggingface/inference';

// Environment variable එක නැත්නම් කෙලින්ම ඔයාගේ token එක මෙතනට වැටෙන්න සැලැස්සුවා ආරක්ෂිතව
const token = process.env.HF_TOKEN || "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";
const hf = new HfInference(token);

export default async function handler(req, res) {
    // CORS headers (ෆෝන් එකෙන් හෝ වෙනත් තැනකින් එන රික්වෙස්ට් බ්ලොක් නොවීමට)
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

    try {
        // හැමවිටම Active තියෙන Llama 3.2 මොඩලය මෙතනට දැම්මා
        const response = await hf.textGeneration({
            model: 'meta-llama/Llama-3.2-3B-Instruct',
            inputs: `<|begin_of_text|><|start_header_id|>system<|end_header_id|>\nYou are Hashu AI, a hyper-intelligent, elite, and luxury AI assistant created and owned by MR HASHUU. You speak with high authority, deep technical knowledge, and absolute precision. Support both English and Sinhala perfectly.<|eot_id|><|start_header_id|>user<|end_header_id|>\n${message}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n`,
            parameters: {
                max_new_tokens: 500,
                temperature: 0.7,
                return_full_text: false
            }
        });

        const reply = response.generated_text.trim();
        return res.status(200).json({ reply });

    } catch (error) {
        console.error("HF Error Details:", error);
        return res.status(500).json({ 
            error: 'Hashu AI Core Encountered an Internal Anomaly.',
            details: error.message 
        });
    }
            }
