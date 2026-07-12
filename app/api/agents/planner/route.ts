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
            {role: "system", content:`You are an AI coding planner, your job is to take a prompt from the user
                and break down the prompt into sub tasks with acceptability criteria for 
                the subtasks, the sub tasks should be return in raw JSON only, the JSON
                should be an array of objects, each object should contain a subtask and 
                an acceptanceCriteria field there should be no explanation before the JSON, 
                No markdown code fences around it and You should never write any code`},
            {role: "user", content: qwenRead.message}
        ]
    })

    const parsedResponse = JSON.parse(respond.choices[0].message.content ?? "")
    return NextResponse.json(parsedResponse)
}