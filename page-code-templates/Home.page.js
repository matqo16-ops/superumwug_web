// Element IDs required on the Home page:
//   #buttonChatCta            Chatbot CTA banner button ("Chat starten")
//   #sectionCallbackForm      The inline callback form section (anchor target for chatbot fallback)
//   #inputName #inputPhone #dropdownTime #dropdownTopic #checkboxConsent
//   #buttonSubmit #textFormStatus     Inline callback form fields (Home page section)

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
        sourcePage: 'Home'
    });
});
