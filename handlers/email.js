const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const util = require('util');
const emailConfig = require('../config/email');

let transport = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
      user: emailConfig.user,
      pass: emailConfig.pass
    }
  });

  const generarHtml = (archivo, opciones = {}) => {
      console.log(`${__dirname}/../views/emails/reestablecer-password.pug`);
      const html = pug.renderFile(`${__dirname}/../views/emails/${archivo}.pug`, opciones);
      console.log(juice(html));
      return juice(html);
  }

exports.enviar = async (opciones) => {
    const html = generarHtml(opciones.archivo, opciones);
    const text = htmlToText.fromString();
    
    let opcionesEmail ={
        from: 'UpTask <no-reply@uptask.com>', // sender address
        to: opciones.usuario.email, // list of receivers
        subject: opciones.subject, // Subject line
        text,
        html
      };

      const enviarEmail = util.promisify(transport.sendMail,transport);
      return enviarEmail.call(transport, opcionesEmail)

}
