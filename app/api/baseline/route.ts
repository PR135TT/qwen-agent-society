import OpenAI from "openai"
import {NextResponse} from "next/server"

const openai = new OpenAI ({
    apiKey: process.env.DASHSCOPE_API_KEY,
    baseURL: "https://dashscope-intl.aliyuncs.com/compatible-mode/v1"
})

type ResponseData = {
    message: string
}

export async function POST(req: Request) {

    const qwenRead = await req.json() as ResponseData

    const respond = await openai.chat.completions.create({
        model: "qwen3.7-plus",
        messages: [
            {role: "system", content:`You are an AI coding assistant, your job is to 
                take a prompt from the user, show your planning steps, what the task 
                was broken into and list out the parts before writing any code, the rules 
                for this are that the written code must be clean, readable, must obey the 
                coding standards and best practices which are consistency, use of naming conventions, 
                documentation, efficiency, testing and error handling, the output for the code should be 
                vertical formatting with high level functions at the top and lower level details after with 
                horizontal formatting with line length at 100-120 characters per line, the code should be unit 
                tested, test individual functions and components in isolation before testing everything together, 
                use verification and validation with test planning, the code should be written in javascript only or when specified by the user`},
                {role: "user", content: qwenRead.message}
        ]
    })

    return NextResponse.json(respond.choices[0].message.content)
}