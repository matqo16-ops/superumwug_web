// Element IDs required on the B2B page:
//   #buttonChatCta              Chatbot CTA banner button
//   #sectionPartnerForm          Partner/corporate callback form section (chatbot fallback target)
//   #dropdownIAm #inputName #inputPhone #dropdownTime #dropdownTopic
//   #inputCompany (optional) #checkboxConsent #buttonSubmit #textFormStatus

import { openChatbot } from 'public/chatbot';
import { wireCallbackForm } from 'public/callbackForm';

$w.onReady(function () {
    if ($w('#buttonChatCta').length) {
        $w('#buttonChatCta').onClick(() => openChatbot($w, '#sectionPartnerForm'));
    }

    wireCallbackForm($w, {
        ids: {
            name: '#inputName',
            phone: '#inputPhone',
            preferredTime: '#dropdownTime',
            topic: '#dropdownTopic',
            partnerType: '#dropdownIAm',
            message: '#inputCompany',
            consent: '#checkboxConsent',
            submitButton: '#buttonSubmit',
            statusText: '#textFormStatus'
        },
        sourcePage: 'B2B'
    });
});
