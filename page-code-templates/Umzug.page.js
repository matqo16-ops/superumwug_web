// Element IDs required on the Umzug page:
//   #buttonChatCta             Chatbot CTA banner button
//   #sectionGuarantee           The "Unbeschädigt-Garantie" section (chatbot fallback + secondary hero CTA target)
//   #buttonScrollToGuarantee    Hero secondary CTA ("Zur Unbeschädigt-Garantie")
//   FAQ (repeat the pattern below per question — 5 pairs on this page):
//   #faqQuestion1 .. #faqQuestion5     Clickable question text/box elements
//   #faqAnswer1 .. #faqAnswer5         Collapsible answer containers (start collapsed in Studio)

import { openChatbot } from 'public/chatbot';

const FAQ_COUNT = 5;

$w.onReady(function () {
    if ($w('#buttonChatCta').length) {
        $w('#buttonChatCta').onClick(() => openChatbot($w, '#sectionGuarantee'));
    }

    if ($w('#buttonScrollToGuarantee').length) {
        $w('#buttonScrollToGuarantee').onClick(() => $w('#sectionGuarantee').scrollTo());
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
