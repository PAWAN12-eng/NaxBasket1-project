import { Resend } from 'resend';
import dotenv from 'dotenv'
dotenv.config()

if (!process.env.RESEND_APE) {
    console.log('provide the RESEND_APE in the env file')
}

const resend = new Resend(process.env.RESEND_APE);

const sendemail = async ({ sendTo, subject, html }) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'NexBasket <onboarding@resend.dev>',
            to: sendTo,
            subject: subject,
            html: html,
        });

        if (error) {
            return console.error({ error });
        }

        return data
    } catch (error) {
        console.log(error)
    }
}

export default sendemail;