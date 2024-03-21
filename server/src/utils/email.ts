import sgMail from "@sendgrid/mail";

// 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;
// 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

export const sendEmailFromReception = (
  recipientEmail: string,
  subject: string,
  html: string
) => {
  sgMail.setApiKey(
    ""
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
};
