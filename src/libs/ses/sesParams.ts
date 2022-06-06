// import { itemTemplate } from './template';
export const sesParams = (templateData, receiver, customerEmail) => {

  const email =
    receiver == 'halalo-confirm-order' ? customerEmail : 'a.tayeb.ps@gmail.com';
  const params = {
    Destination: {
      CcAddresses: ['ahmadtayeb91@gmail.com'],
      ToAddresses: [email, 'luciesolimany@googlemail.com'],
    },
    Source: 'dr.lucie.solimany@bosco-consulting.info',
    Template: receiver, //'halalo-confirm-order',
    TemplateData: JSON.stringify(templateData),
    // ReplyToAddresses: ['ahmadtayeb91@gmail.com'],
  };
  return params;

};
