export interface Worry {
  id: string;
  category: "Phone & Computer" | "The Car" | "Travel" | "Everyday";
  question: string;
  shortAnswer: string;
  fullAnswer: string;
  stillWorried?: string;
  actionLink?: { text: string; url: string };
}

export const worries: Worry[] = [
  {
    id: "phone-hot",
    category: "Phone & Computer",
    question: "Why is my phone getting hot?",
    shortAnswer:
      "Because you're using it, and that's normal. A warm phone is a working phone, not a broken one. It's also under warranty, so please don't spend a dime.",
    fullAnswer:
      "Phones get warm when you use them, especially with an app like Snapshot that follows your location for the insurance discount. That warmth is the trade for the lower bill, and it's normal. Your phone is smart: if it ever truly got too hot, it would turn itself off on its own to stay safe, so it can't hurt itself. Please don't buy a new phone or go to a repair store. This phone is less than a year old, which means it's under warranty, so if anything is ever truly wrong, Google fixes it for free. I made you a full walkthrough, including how to get a real Google expert to call you for free, day or night. Tap below.",
    actionLink: {
      text: "Open the warm phone walkthrough",
      url: "/hotphone",
    },
  },
  {
    id: "phone-hacked",
    category: "Phone & Computer",
    question: "Is my phone hacked?",
    shortAnswer:
      "Almost certainly not. What you're seeing is probably just ads or notifications \u2014 which are annoying, but not dangerous.",
    fullAnswer:
      "Here's the truth, Mom: phones getting actually hacked is very rare, and when it happens, the signs are specific \u2014 your battery dies in hours, your bill shows charges you didn't make, or your accounts send messages you didn't write. Random ads popping up, strange notifications, or apps you don't remember installing are almost always one of three things: (1) an app you installed that's showing ads, (2) a website you visited asking to send notifications, or (3) a bookmarked promotion. None of those mean someone is watching you. If you're ever unsure, just restart your phone \u2014 that clears most of the noise. And if an app is annoying you, you can delete it in two taps.\n\n### OR is this a real prompt my phone makes?\n\nSometimes your phone asks for things that look scary but are actually safe:\n\u2022 **iOS update:** Safe, but plug in and connect to Wi-Fi first.\n\u2022 **App permission requests:** Only say yes if you actually just opened that app and it needs the camera or location.\n\u2022 **Terms of Service:** Safe to tap 'I agree'; companies update these all the time.\n\u2022 **Storage full:** This is real, but I can fix it for you. Don't delete anything in a panic.\n\u2022 **Touch ID / Face ID:** This is just your phone's way of verifying it's really you.\n\nWhen in doubt: don't tap. Take a screenshot and send it to me.",
    stillWorried:
      "If you want to be extra sure, go to Settings \u2192 Apps \u2192 and uninstall anything you don't recognize.",
  },
  {
    id: "am-i-texting-too-much",
    category: "Everyday",
    question: "Am I texting Ben too much?",
    shortAnswer:
      "No. I built this site so you'd have somewhere to ask, and I'm happy to help you work through this.",
    fullAnswer:
      "When you text me, it's the site that's working \u2014 not you being a burden. I want you to feel calm and informed, and if that takes fifty questions, then that's what it takes. If I'm in a meeting or sleeping, I just won't answer right away. I'll get back to you when I'm free. You never have to apologize for asking a question or feeling overwhelmed.",
    stillWorried:
      "If you're feeling guilty, remember: I'd much rather get ten texts from you than have you sitting there worrying alone.",
  },
  {
    id: "vw-id4-ac",
    category: "The Car",
    question: "Ben's car is still running \u2014 the AC is on!",
    shortAnswer:
      "It's off. Ben's VW ID4 pre-cools the cabin on a schedule from the battery. The car is parked, locked, and not running.",
    fullAnswer:
      "Ben's ID4 is an electric car, so there's no engine to leave running. What you're hearing is a scheduled pre-cool (or pre-heat) \u2014 the car uses a little bit of its battery to make the inside comfortable before he gets in. It's the same principle as the fridge running in the kitchen: it's doing its job from its own power source, and the car is fully off. Ben has the key, the doors are locked, nothing is wasted.",
    stillWorried:
      "If Ben's around and you're really unsure, just ask him. He can pull up the Volkswagen app and show you that the car is 'off' and just running climate from the schedule.",
  },
  {
    id: "flight-connection",
    category: "Travel",
    question: "Will I make my flight connection?",
    shortAnswer:
      "Probably yes \u2014 about 93% of the time for tight connections. And if you don't, the airline automatically rebooks you.",
    fullAnswer:
      "I built a whole tool to walk you through this, because I know it worries you. It takes your layover time, your airports, and your airline and tells you the real probability (usually over 90%). It also explains exactly what happens if anything goes wrong \u2014 you won't be stranded. Tap below for the full breakdown.",
    actionLink: {
      text: "Open the Flight Confidence tool",
      url: "https://layover.93.fyi",
    },
  },
  {
    id: "scam-text",
    category: "Phone & Computer",
    question: "Is this text or email a scam?",
    shortAnswer:
      "If it's asking you to click a link, pay something, or share a code \u2014 assume it's a scam. Real banks, Amazon, and the IRS don't text you like that.",
    fullAnswer:
      "Scammers are lazy and they all use the same tricks. Red flags: (1) urgency ('your account will be closed in 24 hours!'), (2) a link you weren't expecting, (3) asks for a code or password, (4) offers something free. Real companies let you log in through their official app or website \u2014 they never send you a link to click. When in doubt, don't reply, don't click. Just delete. If you're worried the message might be real, open the real app yourself (not the link) and check.",
    stillWorried:
      "Forward suspicious texts to 7726 (SPAM) \u2014 it reports them to your carrier free.",
  },
  {
    id: "where-is-ben",
    category: "Travel",
    question: "Where is Ben going? When?",
    shortAnswer:
      "Ben is currently in Oakland Park, FL. His next trip is to Orlando on May 15.",
    fullAnswer:
      "I'm keeping my travel schedule here so you can always check without having to remember the details. I'm always reachable by text even when I'm traveling.\n\n\u2022 **Orlando, FL:** May 15 \u2013 May 19 (Visiting family)\n\u2022 **Miami, FL:** May 29 (Day trip)\n\nI'll be reachable by text the whole time. If you need to verify dates for a visit, this is the best place to look.",
  },
  {
    id: "did-i-do-something-wrong",
    category: "Everyday",
    question: "Did I just do something wrong?",
    shortAnswer:
      "Almost certainly not. And even if you did, it's probably easy to fix.",
    fullAnswer:
      "Mom, computers and phones are built to be used. You can't break them by tapping the wrong thing or forgetting a step. If something looks different than it did before, or if a message popped up that you didn't expect, it's just the machine doing its thing. It doesn't mean you made a mistake. If you're worried about the bedbug plan specifically, remember: the plan is built to handle small slip-ups. One missed day or one forgotten glove doesn't break the outcome.",
    stillWorried:
      "If you're really worried you broke something, just tell me. I can usually fix it in thirty seconds.",
  },
  {
    id: "general-reassurance",
    category: "Everyday",
    question: "What about something not listed here?",
    shortAnswer:
      "Type it in the box below and I'll send it straight to Google. The first few results usually have the answer.",
    fullAnswer:
      "This site only covers the handful of things you ask about most. For anything else, the search box at the bottom will Google it for you \u2014 no typing into browser bars, no squinting. Just type what you're wondering, hit the button, and read what comes up.",
  },
];
