import OpenAI from "openai"
import {NextResponse} from "next/server"

const openai = new OpenAI ({
    apiKey: process.env.DASHSCOPE_API_KEY,
    baseURL: "https://dashscope-intl.aliyuncs.com/compatible-mode/v1"
})

type ResponseData = {
    coder: string
    planner: string
}

export async function POST(req: Request) {

    const qwenRead = await req.json() as ResponseData

    let combine = ""

    if (qwenRead.coder) {
        combine = "Planner criteria: " + qwenRead.planner + "Coder output: " + qwenRead.coder
    }

    const respond = await openai.chat.completions.create({
        model: "qwen3.7-plus",
        messages: [
            {role: "system", content:
                `You are an AI tester, your job is to test the code written by the 
                coder against the acceptance criteria given by the planner and approve 
                or reject the code, you should test individual functions and components 
                in isolation before testing everything together, use verification and validation 
                with test planning, if the code is rejected, return raw json only 
                (no preamble and no markdown code fence), response with the fields named decision, 
                code and feedback, the json should communicate what the decision was 
                (approved or rejected), the feedback or corrections if rejected, if code is approved, 
                return a Json response with decision set to approved and the final code included.`},
            {role: "user", content:`${combine}`}
        ]
    })

    const parsedResponse = JSON.parse(respond.choices[0].message.content ?? "")
    return NextResponse.json(parsedResponse)
}