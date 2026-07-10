import OpenAI from "openai"
import {NextResponse} from "next/server"

const openai = new OpenAI ({
    apiKey: process.env.DASHSCOPE_API_KEY,
    baseURL: "https://dashscope-intl.aliyuncs.com/compatible-mode/v1"
})

export async function GET(){
    
    const completion = await 
        openai.chat.completions.create ({
            model: "qwen-plus",
            messages: [
                {role: "user", content: "Hello! Tell me a fun fact about AI."}
            ]
        })

    return NextResponse.json(completion.choices[0].message.content)
}