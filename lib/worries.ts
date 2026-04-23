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
    id: "phone-hacked",
    category: "Phone & Computer",
    question: "Is my phone hacked?",
    shortAnswer:
      "Almost certainly not. What you're seeing is probably just ads or notifications \u2014 which are annoying, but not dangerous.",
    fullAnswer:
      "Here's the truth, Mom: phones getting actually hacked is very rare, and when it happens, the signs are specific \u2014 your battery dies in hours, your bill shows charges you didn't make, or your accounts send messages you didn't write. Random ads popping up, strange notifications, or apps you don't remember installing are almost always one of three things: (1) an app you installed that's showing ads, (2) a website you visited asking to send notifications, or (3) a bookmarked promotion. None of those mean someone is watching you. If you're ever unsure, just restart your phone \u2014 that clears most of the noise. And if an app is annoying you, you can delete it in two taps.",
    stillWorried:
      "If you want to be extra sure, go to Settings \u2192 Apps \u2192 and uninstall anything you don't recognize.",
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
    id: "general-reassurance",
    category: "Everyday",
    question: "What about something not listed here?",
    shortAnswer:
      "Type it in the box below and I'll send it straight to Google. The first few results usually have the answer.",
    fullAnswer:
      "This site only covers the handful of things you ask about most. For anything else, the search box at the bottom will Google it for you \u2014 no typing into browser bars, no squinting. Just type what you're wondering, hit the button, and read what comes up.",
  },
];
