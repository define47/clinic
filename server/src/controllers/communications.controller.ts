import { FastifyReply, FastifyRequest } from "fastify";
import sgMail from "@sendgrid/mail";

export class CommunicationsController {
  private async sendEmailFromReception(
    recipientEmail: string,
    subject: string,
    html: string
  ) {
    sgMail.setApiKey(
      "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"
    );
    const msg = {
      to: recipientEmail,
      from: "mtb.balan@gmail.com",
      subject: subject,
      text: "text",
      html: html,
    };
    sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.error(error);
      });
  }

  public async sendEmail(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body: any = request.body;
      await this.sendEmailFromReception(
        body.recipientEmail,
        body.subject,
        body.html
      );
      reply.code(200).send({ success: true });
    } catch (error) {
      console.log(error);
    }
  }
}
