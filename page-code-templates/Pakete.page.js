// Element IDs required on the Pakete page:
//   #buttonChatCta              Chatbot CTA banner button
//   #sectionPackages             Container holding the 4 package cards (chatbot fallback target)
//   Each package card's "Preis per Chatbot oder Rückruf erfragen" CTA:
//   #buttonPaket1Chat .. #buttonPaket4Chat   (opens chatbot)

import { openChatbot } from 'public/chatbot';

const PACKAGE_COUNT = 4;

$w.onReady(function () {
    if ($w('#buttonChatCta').length) {
        $w('#buttonChatCta').onClick(() => openChatbot($w, '#sectionPackages'));
    }

    for (let i = 1; i <= PACKAGE_COUNT; i++) {
        const buttonId = `#buttonPaket${i}Chat`;
        if ($w(buttonId).length) {
            $w(buttonId).onClick(() => openChatbot($w, '#sectionPackages'));
        }
    }
});
