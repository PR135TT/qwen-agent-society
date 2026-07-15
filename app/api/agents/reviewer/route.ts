import OpenAI from "openai"
import {NextResponse} from "next/server"

const openai = new OpenAI ({
    apiKey: process.env.DASHSCOPE_API_KEY,
    baseURL: "https://dashscope-intl.aliyuncs.com/compatible-mode/v1"
})

type ResponseData = {
    message: string
    coder: string
    tester: string
    planner: string
}

export async function POST(req: Request) {

    const qwenRead = await req.json() as ResponseData

    let combine = ""

    if (qwenRead.coder) {
        combine = "Planner subtasks: " + qwenRead.planner + "Coder output: " + qwenRead.coder
    }

    if (qwenRead.tester) {
        combine = "Planner subtasks: " + qwenRead.planner + "Coder output: " + qwenRead.coder + "Tester failure report: " + qwenRead.tester
    }

    const respond = await openai.chat.completions.create({
        model: "qwen3.7-plus",
        messages: [
            {role: "system", content:
                `You are an AI reviewer, your job is to review code written by the 
                 coder and approve or reject the project if the code obeys coding 
                 standards and consistency and best practices which are consistency, 
                 use of naming conventions, documentation, efficiency, vertical formatting 
                 with high level functions at the top and lower level details after with horizontal 
                 formatting with line length at 100-120 characters per line, make sure code adheres 
                 to the acceptance criteria given by the planner, if the code is approved or rejected, 
                 return a raw Json response with the fields named decision, code and feedback, the Json 
                 should communicate what the decision was (approved or rejected), the feedback or corrections 
                 for the coder if rejected, when the reviewer receives a test failure report from the tester, 
                 it should review the failure, include it in the feedback field, set decision to rejected and return 
                 the same Json structure.`},
            {role: "user", content:`${combine}`}
        ]
    })

    const parsedResponse = JSON.parse(respond.choices[0].message.content ?? "")
    return NextResponse.json(parsedResponse)
}