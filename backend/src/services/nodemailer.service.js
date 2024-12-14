import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
import { handleError } from '../utils/errorHandler.js';

import { EMAIL, PASS } from '../config/configEnv.js';

const transporter = nodemailer.createTransport({
    host : 'smtp.gmail.com',
    port : 465,
    secure : true,

    auth: {
        user: EMAIL,
        pass: PASS
    }
});

/**
 * @name enviarEmail
 * @description Envía un correo electrónico para los integrantes de banda instrumental.
 * @param {String} to - Correo electrónico del destinatario.
 * @param {String} subject - Asunto del correo electrónico.
 * @param {String} text - Cuerpo del correo electrónico.
 */

async function enviarEmail(to, subject, text) {
    try {
        const mailOptions = {
            from: EMAIL,
            to,
            subject,
            text
        };
        console.log("Enviando correo electrónico...");  
        const info = await transporter.sendMail(mailOptions);
        console.log("Email enviado:", info.messageId); // Imprime el ID del mensaje
        return [null, "Correo electrónico enviado"];
    } catch (error) {
        handleError(error, "nodemailer.service -> enviarEmail");
        return [error.message, null];
    } 
}

export default { enviarEmail }