1. The planner's job is to break a user's coding task into a clear, ordered list of subtasks for the coder to implement.
The input for the planner is the raw task description from the user
The output is the numbered list of subtasks with clear acceptance criteria for each
The rules are to always be specific (not "write the function" but "write a function that does X with Y inputs returning Z"), never write any code itself
The planner's job is done when the tasks are sent to the coder

2. The coder's job is to write functional code with readable syntax and comments
The input for the coder should be the output from the planner first
If the coder receives output from the reviewer it should include the output from the planner and output from the reviewer on the errors in the code and output from the tester
The output should be the code specified from the input from the planner
The rules are for the code to be specific, clean, readable, functional and must include comments

3. The reviewer's job is to review the code and make sure the code is functional, clean, readable
The input for the reviewer is the output from the coder and also an output sent by the tester if the tester fails the code sent to it by the coder
The output should be a list of errors and corrections to be read by the coder
The rules are for the reviewer to reject or approve, reject if there are errors and send back to the coder and approve if the code is good and send to the tester

4. The Tester's job is to make sure the code works as specified by the user
The input for the tester is the code written by the coder
The output should be if the coder passed the test or failed, if it failed, what caused it to fail exactly
The rules are for the tester to reject or approve, reject if there are errors and send it back to the reviewer with a list of errors
if approve send final code to user 

If the revision round exceeds 3, stop and return 

User submits tasks 
-Planner breaks it into subtasks
-Coder writes code
-Reviewer checks code
	-Reject: send feedback to Coder -Coder revises
	-Approve: send to Tester
-Tester runs test
	-Fail: send failure report to Reviewer
	-Pass: task complete return final code to user
-If revision rounds exceed 3: stop and return best attempt