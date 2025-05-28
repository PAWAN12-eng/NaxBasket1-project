const verificationemailtamplate=({name,url})=>{
    return`
   
        <p>Dear ${name}</p>
        <p>Thanke you for resistering NexBasket</p>
        <a href=${url} style="color:white; background:blue; margin-top:10px; ">
         verify email
        </a>
   
    `
}

export default verificationemailtamplate