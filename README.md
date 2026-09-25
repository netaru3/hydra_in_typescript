Hydra is a brute-force tool written in C; I wrote my own version in TypeScript.

Flag explanation:

--url: Expects a URL in string format

--body: Expects a string containing a body in JSON format or form mode (depending on how you configure the content)


--content: Expects a string; in the content parameter, you specify the format in the header. If you want the request to be in JSON format, use: --content “application/json” (this is the default),

If you want the request to be in form format, use this: --content “application/x-www-form-urlencoded”



--wordlist: Expects a string containing the path to a wordlist to crack (e.g., /usr/share/wordlists/rockyou.txt)

The default wordlist is the one used in the example


--error: Expects a string containing the error message, e.g., --error “invalid access”


--v: Expects a number; controls Hydra’s speed. With --v 50, you’ll have 50 workers making requests in parallel. I recommend a speed between 50 and 100



--password: Expects a Boolean; if true, it will crack the password 


--username: Expects a Boolean; if true, it will crack the username


Use --password true when you want to crack a password (by including the username in the body), and use --username true when you want to crack a username knowing the password (by including the password in the body)


ej of the a command: node hydra.ts --url "https://localhost:3000/login" --body '{"username":"netaru3","password":""}' --password true --error "error"


The password must always be the second element and the username the first. A very common question is: “If I want to crack the password, what should I put as the password in the body?” You can put anything as long as the second element represents the password.


For example, if I were to write: ej of the a command: node hydra.ts --url "https://localhost:3000/login" --body '{"other_username":"netaru3","other_password":"It_doesn't_matter_what_I_put_here"}' --password true --error "error"



