// Element IDs required on the Kontakt page:
//   #buttonChatCta              Chatbot CTA banner button
//   #sectionCallbackForm         Primary callback form section (chatbot fallback target)
//   #inputName #inputPhone #dropdownTime #dropdownTopic #checkboxConsent
//   #buttonSubmit #textFormStatus

import { openChatbot } from 'public/chatbot';
import { wireCallbackForm } from 'public/callbackForm';

$w.onReady(function () {
    if ($w('#buttonChatCta').length) {
        $w('#buttonChatCta').onClick(() => openChatbot($w, '#sectionCallbackForm'));
    }

    wireCallbackForm($w, {
        ids: {
            name: '#inputName',
            phone: '#inputPhone',
            preferredTime: '#dropdownTime',
            topic: '#dropdownTopic',
            consent: '#checkboxConsent',
            submitButton: '#buttonSubmit',
            statusText: '#textFormStatus'
        },
        sourcePage: 'Kontakt'
    });
});
