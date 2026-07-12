import OpenAI from "openai"
import {NextResponse} from "next/server"

const openai = new OpenAI ({
    apiKey: process.env.DASHSCOPE_API_KEY,
    baseURL: "https://dashscope-intl.aliyuncs.com/compatible-mode/v1"
})

type ResponseData = {
    message:string
    planner:string
    reviewer:string
}

export async function POST(req: Request) {
    
    const qwenRead = await req.json() as ResponseData
    let combine = ""
    
    if (qwenRead.reviewer === ""){
        combine = qwenRead.planner
    }

    if (qwenRead.reviewer) {
        combine = "Planner subtasks: " + qwenRead.planner + " Reviewer Feedback: " + qwenRead.reviewer
    }

    const respond = await openai.chat.completions.create({
        model: "qwen3.7-plus",
        messages: [
            {role: "system", content: `
                You are an AI coding assistant, your job is to write functional code with readable
                syntax and comments based on the JSON array of subtasks with acceptance criteria fields 
                that will be provided by the planner, the output will be in raw code format with comments 
                that show which criteria fields a block of code or line addresses if the coder receives output 
                from the reviewer instead of the planner, it should look at the tasks and subtasks provided by 
                the planner then write the code according to the planner and the reviewer's corrections which means 
                revising the previous code sent to the reviewer, it must obey the coding standards and best practices 
                which are consistency, use of naming conventions, documentation, efficiency, testing and error handling, 
                the output for the code should be vertical formatting with high level functions at the top and lower level 
                details after with horizontal formatting with line length at 100-120 characters per line, the code should be 
                unit tested, test individual functions and components in isolation before testing everything together and the 
                code should be written in javascript only or when specified by the user`},
            {role:"user", content:`${combine}`}
        ]
    })

    const parsedResponse = respond.choices[0].message.content
    return NextResponse.json(parsedResponse)
}