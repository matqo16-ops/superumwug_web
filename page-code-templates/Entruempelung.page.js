// Element IDs required on the Entrümpelung page:
//   #buttonChatCta              Chatbot CTA banner button
//   #sectionHowItWorks           "So läuft eine Entrümpelung ab" section (chatbot fallback target)
//   #buttonScrollToHowItWorks    Hero secondary CTA ("Ablauf ansehen")
//   FAQ (5 pairs, same pattern as Umzug page):
//   #faqQuestion1 .. #faqQuestion5
//   #faqAnswer1 .. #faqAnswer5

import { openChatbot } from 'public/chatbot';

const FAQ_COUNT = 5;

$w.onReady(function () {
    if ($w('#buttonChatCta').length) {
        $w('#buttonChatCta').onClick(() => openChatbot($w, '#sectionHowItWorks'));
    }

    if ($w('#buttonScrollToHowItWorks').length) {
        $w('#buttonScrollToHowItWorks').onClick(() => $w('#sectionHowItWorks').scrollTo());
    }

    for (let i = 1; i <= FAQ_COUNT; i++) {
        const questionId = `#faqQuestion${i}`;
        const answerId = `#faqAnswer${i}`;
        if ($w(questionId).length && $w(answerId).length) {
            $w(questionId).onClick(() => {
                const answer = $w(answerId);
                if (answer.collapsed) {
                    answer.expand();
                } else {
                    answer.collapse();
                }
            });
        }
    }
});
