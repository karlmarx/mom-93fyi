export interface Worry {
  id: string;
  category:
    | "Phone & Computer"
    | "The Car"
    | "Travel"
    | "At Home"
    | "Money"
    | "Everyday";
  question: string;
  shortAnswer: string;
  fullAnswer: string;
  stillWorried?: string;
  actionLink?: { text: string; url: string };
  phoneCall?: { label: string; number: string };
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
      "If you want to be extra sure, go to Settings \u2192 Apps \u2192 and uninstall anything you don't recognize. Or call me and we'll do it together over FaceTime.",
    phoneCall: { label: "Call me", number: "+1XXXXXXXXXX" },
  },
  {
    id: "vw-id4-ac",
    category: "The Car",
    question: "The AC is running \u2014 is the car still on?",
    shortAnswer:
      "No. Your VW ID4 is off. The AC you hear is a scheduled pre-cool that runs from the battery even when the car is parked and locked.",
    fullAnswer:
      "Your ID4 has a feature where it cools (or heats) the cabin on a schedule so you're comfortable when you get in. It runs quietly from the big battery \u2014 NOT from the engine, because the ID4 doesn't have one. This is supposed to happen. The car is absolutely off, the key is with you, and the doors are locked. It's the same as your refrigerator running: you don't worry the fridge is 'on' \u2014 it's just doing its job from its battery.",
    stillWorried:
      "Want to turn off the scheduled climate? Open the Volkswagen app \u2192 Climate \u2192 uncheck the scheduled times. But honestly, it's a nice feature \u2014 let it do its thing.",
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
      "Forward suspicious texts to 7726 (SPAM) \u2014 it reports them to your carrier free. Or send me a screenshot and I'll tell you.",
    phoneCall: { label: "Text me a screenshot", number: "+1XXXXXXXXXX" },
  },
  {
    id: "stove-on",
    category: "At Home",
    question: "Did I leave the stove on?",
    shortAnswer:
      "Modern stoves automatically turn off after about 12 hours. If you can't remember, the kitchen would tell you \u2014 you'd smell it.",
    fullAnswer:
      "Your stove has safety features you can count on: most burners auto-shut-off after 12 hours of being on, and the oven has the same. Even if you did leave it on, it wouldn't start a fire instantly \u2014 you'd notice heat, smell something, or hear the exhaust fan kick in. For real peace of mind: get in the habit of glancing at the knobs each time you leave the kitchen. They should all point straight up.",
    stillWorried:
      "Install a smart plug for your countertop appliances (I can set it up). Or put a sticky note by the door: 'Stove knobs up? \u2713'",
  },
  {
    id: "door-locked",
    category: "At Home",
    question: "Did I lock the front door?",
    shortAnswer:
      "You almost certainly did. Locking up is muscle memory \u2014 you'd notice if you didn't.",
    fullAnswer:
      "Your brain remembers routine actions without needing to consciously record them. That's why you can drive home without thinking about each turn. The feeling of 'did I lock it?' is normal but usually wrong \u2014 your hand already did the work. When in doubt, the 'lock twice on purpose' trick works: when you leave, lock the door, then say out loud 'I locked the door at [time].' That single conscious moment creates a memory you can recall later.",
    stillWorried:
      "We can install a smart lock that tells your phone whether it's locked. I've been meaning to set one up for you.",
  },
  {
    id: "computer-slow",
    category: "Phone & Computer",
    question: "Why is my computer so slow?",
    shortAnswer:
      "Almost always: too many browser tabs open, or it hasn't been restarted in a while. Both are fixable in 30 seconds.",
    fullAnswer:
      "Computers don't 'break' from normal use. They get slow for the same reason a desk gets cluttered \u2014 too many things open at once. The fix: (1) Close all browser tabs you're not using, (2) Quit apps you're not using, (3) Restart the whole computer. That clears everything out and almost always brings back the speed you remember.",
    stillWorried:
      "If it's still slow after a restart, call me \u2014 we can FaceTime and I'll check it remotely in 5 minutes.",
    phoneCall: { label: "FaceTime me", number: "+1XXXXXXXXXX" },
  },
  {
    id: "phone-call-real",
    category: "Money",
    question: "Is this phone call from my bank real?",
    shortAnswer:
      "If they called YOU, assume it's a scam. Hang up. Call the number on the back of your card to verify.",
    fullAnswer:
      "Real banks almost never call you. If they do, they already know everything they need \u2014 they won't ask for your PIN, password, or Social Security number. Scammers always do. The safe rule: any call that asks you to confirm personal info, move money, or 'verify' something \u2014 hang up. Not rude. Smart. Then call your bank yourself using the phone number printed on the back of your debit card. That's guaranteed to be real.",
    stillWorried:
      "Put this on a sticky note on your phone: 'They called me? Hang up. Call back the number on my card.'",
  },
  {
    id: "medications",
    category: "Everyday",
    question: "Did I take my medication today?",
    shortAnswer:
      "A weekly pill organizer with one compartment per day solves this completely. If today's compartment is empty, you took it.",
    fullAnswer:
      "This is a problem with a simple answer: a pill organizer. Sunday through Saturday, one box each. You fill it on Sunday morning. Every day you just check \u2014 is today's box empty? Then yes, you took it. No memory required. You can get one at any pharmacy for about $5, or I can send you one.",
    stillWorried:
      "Want a fancier option? There are pill dispensers that beep at medication time. Let me know and I'll pick one out.",
  },
  {
    id: "general-reassurance",
    category: "Everyday",
    question: "But what if...?",
    shortAnswer:
      "Whatever it is, we'll figure it out together. Call me anytime \u2014 that's what I'm here for.",
    fullAnswer:
      "Mom, here's the truth: most of the things you worry about never happen. And the ones that do? They're almost always fixable, and I'm always just a phone call away. You've handled harder things than any of this. Trust yourself. And when you can't, trust that I've got you.",
    phoneCall: { label: "Call your son", number: "+1XXXXXXXXXX" },
    stillWorried:
      "Seriously, call me. Even if it's nothing. Especially if it's nothing.",
  },
];
