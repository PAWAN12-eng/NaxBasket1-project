const forgotpasswordTemplate = ({name, otp}) => {
    return `
     <div>        
        <p>Dear ${name}</p>
        <p>Thanke you for resistering NexBasket</p>
        <p>You're request a password resset . Please use following OTP code to 
        reset your password.</p>
        <div style="background:yellow;font-size:20px; padding:20px ; text-align:center; font-width:800">
        ${otp}
        </div>
        <p>This otp is valid for 1 hour only. Enter this otp in the NexBasket 
          website to processd with resetting your password.</p>
          <br/>
          </br>
            <p>Thankes</p>
         <p> NexBasket</p>
         </div>
    `
}
export default forgotpasswordTemplate