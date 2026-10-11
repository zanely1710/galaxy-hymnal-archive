import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Music4 } from "lucide-react";
import gloriaeIcon from "@/assets/gloriae-icon.png";

const LETTER = `# To Those Who Find This Page,

If you are reading this, then somehow, Gloriae Musica has found its way to you.

Perhaps you came here looking for a hymn, a piece of sacred music, a sheet for your choir, or simply something that might help you in your service to the Church. Perhaps you have visited this website before, or perhaps today is your very first time.

Whatever brought you here, I hope you find what you are looking for.

But before you continue, I would like to leave you with a message. Not an announcement of new beginnings, not a promise of what is to come, but a small letter from the person who created this place.

My name is **Eleandre Del Rosario**, and Gloriae Musica was my first website.

I still find it a little difficult to believe that I am writing these words.

When I first began this project, I had so many ideas. I imagined what the website could become, what it could offer, and how many people it might someday reach. I wanted to create something that would be useful to others, something that could help choir members, musicians, and anyone who needed access to sacred music.

I wanted to build something meaningful.

And so, with the knowledge I had, the time I could give, and the enthusiasm of someone beginning something entirely new, I started building Gloriae Musica.

It was not always easy. There were things I had to learn, problems I had to solve, and ideas that took time to understand. There were moments when I was excited about what I had accomplished and moments when I knew there was still so much I could improve.

But that was part of the experience.

Gloriae Musica was never just a website to me. It was my first real attempt at creating something of my own and sharing it with the world. It was where I began learning what it meant to turn an idea into something real, to care for a project, and to imagine that something I made might eventually become useful to someone I had never even met.

For that reason alone, this little corner of the internet will always mean something special to me.

But time moves forward, and so do the lives we live beyond our screens.

I am still young. I am still learning, growing, and discovering the person I want to become. There are responsibilities I must attend to, commitments that deserve my time, and dreams I have yet to discover. Life has so much more in store for me, and I know that I cannot remain in one chapter forever, no matter how much that chapter has meant to me.

As much as I would have loved to continue improving this website, adding new features, sharing more music, and bringing every idea to life, I have come to accept that I must make room for the other things life is asking of me.

And so, I have decided to leave Gloriae Musica here.

Not to erase it.

Not to pretend that it never happened.

But to let it remain as it is.

**Gloriae Musica will remain online as a quiet archive of what I once dreamed of building. However, active development has come to an end. There will be no further planned updates, new features, or additions from me.** The website may continue to be visited, and its existing resources may remain available, but I can no longer promise maintenance, continued availability, or future improvements.

In a way, this website will become something like a little ghost of the internet.

It will still have its pages. Its music will still be there, waiting for someone who needs it. Someone may stumble upon it months or even years from now, unaware of the person who once spent his time putting it together.

Someone might find a sheet of music here and use it at a choir rehearsal. Someone might discover a piece they have been searching for. Someone might simply pass through without ever knowing the story behind this website.

And that is all right.

You do not have to know who I am for this website to be useful to you. You do not have to know how it began to find something worthwhile here. You do not even have to remember its name after you leave.

If something I created can continue to help someone, even when I am no longer here to improve it, then I think that is a beautiful thing.

Perhaps that is what makes this goodbye a little easier to accept.

I know that Gloriae Musica will not become everything I once imagined. There will be ideas left unfinished, improvements that will never arrive, and possibilities that will remain possibilities. There will be things I wish I had done differently and things I wish I had more time to complete.

But I do not want to look at this website only through the things it could have been.

I want to remember it for what it was.

My first website.

My first attempt at building something for others.

A small project born from an interest in technology and a love for sacred music.

A little dream that, for a time, I was fortunate enough to bring into existence.

And perhaps, someday, when I look back at this page, I will smile at the thought that there was once a younger version of me who decided to try. A younger version of me who did not know everything, who still had so much to learn, but who wanted to create something that could be shared with others.

I hope I never lose that part of myself.

To everyone who has visited Gloriae Musica, thank you.

To everyone who has used its resources, thank you.

To every choir member, musician, and servant of the Church who may have found even the smallest help here, thank you for giving this project a purpose beyond my own screen.

And to those who may discover this website long after this message has been written, welcome. Although I may no longer be actively working on this project, I hope that what remains here can still be of service to you.

I may never know who you are. I may never know where these pages will lead you or whether something you find here will become part of a song offered during the Holy Mass. I may never hear the music that someone prepares using a resource from this archive.

But I like to think that the work we share can sometimes travel farther than we ever will.

A website can grow quiet. Its creator can move on. The person who once built it can become someone entirely different from the person who first imagined it.

And still, something remains.

Perhaps a page someone bookmarked.

Perhaps a piece of music someone saved.

Perhaps a memory of a project that once existed because somebody cared enough to begin.

I think I can be at peace with that.

I do not know where life will take me from here. I have much more to learn, many more responsibilities to fulfill, and a future that I am only beginning to understand. I will make mistakes, discover new interests, and perhaps create other things that I cannot yet imagine.

But wherever I go, Gloriae Musica will always be part of my beginning.

And for that, I will never be ashamed of leaving it as a memory of a dream I once pursued. Not every project needs to last forever to have mattered. Not everything we begin has to reach its greatest possible form to deserve our gratitude.

Sometimes, it is enough that we tried.

Sometimes, it is enough that we made something that did not exist before.

And sometimes, the most honest thing we can do for something we love is to let it rest without pretending that we can keep giving it what it needs.

So, if you have come here looking for music, please, make yourself at home. Explore what remains, and I hope these resources help you in your service. May the music you find here continue to find its way into churches, choir rehearsals, prayers, and the lives of people who need it.

Please remember that the purpose was never simply to build a website. It was to make something that could serve a purpose beyond itself.

And if Gloriae Musica has done that, even in a small way, then I am grateful.

To the little project that started it all: thank you for teaching me how to begin.

And to everyone who became a part of its story, however briefly: thank you for being here.

I suppose this is where I leave you.

Not with a promise that I will return, because I cannot promise that. Not with an invitation to wait for what comes next, because there may be nothing more to come from me here.

Just a final letter, written with gratitude for what was and acceptance of what will no longer be.

The updates will stop. The new ideas will remain unwritten. The developer will move on to other chapters of life.

But for as long as these pages remain accessible, a little piece of this beginning will remain here, too.

And perhaps, years from now, someone will stumble upon Gloriae Musica and wonder who built it, why it was created, or what happened to the person who left it behind.

If that someone happens to be you, then let this be the answer:

A young person once had a dream. He built what he could with what he knew, shared it with the world, and eventually had to move forward.

He did not finish everything he imagined.

But he was here.

He tried.

And he was grateful.

**Thank you for visiting Gloriae Musica. Thank you for letting a small part of my life become a small part of yours.**

May the music continue, even when this website falls silent.

May your voices never grow weary of singing.

May your service continue to bring comfort, hope, and beauty to those around you.

And may everything we have offered, everything we have learned, and everything we have loved lead us, in the end, closer to the One for whom we sing.

*Ad maiorem Dei gloriam.*

*For the greater glory of God.*

With all my gratitude, and with a quiet farewell,

**Eleandre Del Rosario**
*Founder & Developer of Gloriae Musica*

*The first website I ever built. A chapter I will always carry with me.*`;

const STORAGE_KEY = "developer-letter-dismissed";

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {p.slice(2, -2)}
        </strong>
      );
    }
    if (p.startsWith("*") && p.endsWith("*") && p.length > 2) {
      return <em key={i}>{p.slice(1, -1)}</em>;
    }
    return <span key={i}>{p}</span>;
  });
}

export default function DeveloperMessage() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      const timer = setTimeout(() => setOpen(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setOpen(false);
  };

  const paragraphs = LETTER.split("\n\n");
  const title = paragraphs[0].replace(/^# /, "");
  const body = paragraphs.slice(1);

  return (
    <Dialog open={open}>
      <DialogContent
        className="max-w-2xl max-h-[85vh] p-0 overflow-hidden glass-card-intense border-border [&>button]:hidden"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div className="relative">
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
          <div className="relative flex flex-col items-center pt-8 pb-4 px-6 text-center">
            <img
              src={gloriaeIcon}
              alt="Gloriae Musica"
              className="w-16 h-16 mb-4 rounded-2xl glow-blue drop-shadow-2xl"
            />
            <DialogTitle className="text-2xl font-bold text-gradient-blue font-display">
              {title}
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              A letter from the developer
            </p>
          </div>
        </div>

        <div className="px-8 pb-6 overflow-y-auto max-h-[55vh] space-y-4">
          {body.map((para, i) => (
            <p key={i} className="text-foreground/90 leading-relaxed text-[15px] whitespace-pre-line">
              {renderInline(para)}
            </p>
          ))}
        </div>

        <div className="sticky bottom-0 px-8 py-4 bg-gradient-to-t from-background via-background/95 to-background/60 border-t border-border/50 flex justify-center">
          <Button onClick={dismiss} className="gap-2 glow-blue px-8">
            <Music4 className="w-4 h-4" />
            Continue to Gloriae Musica
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
