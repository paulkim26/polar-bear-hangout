//constants
const dotChar = "•";
const dashChar = "−";
const spaceChar = "/";

const dotDuration = 150;
const dashDuration = dotDuration * 3;
const letterSeparatorDuration = dotDuration * 3;
const spaceDuration = dotDuration * 7;

const countdownUpdateInterval = 10; //ms
const startingRound = 1;

//resources
const toneMorse = new Tone.Oscillator(600, "sine").toDestination();
const toneDing = new Tone.Player("/static/sounds/bike_ding.wav").toDestination();
const toneRailroad = new Tone.Player("/static/sounds/railroad_signal.wav").toDestination();
toneMorse.volume.value = -15;
toneDing.volume.value = -10;

//challenge phrases
const stringWords = `
a
b
c
d
e
f
g
h
i
j
k
l
m
n
o
p
q
r
s
t
u
v
w
x
y
z
a
ability
able
about
above
accept
according
account
across
act
action
activity
actually
add
address
administration
admit
adult
affect
after
again
against
age
agency
agent
ago
agree
agreement
ahead
air
all
allow
almost
alone
along
already
also
although
always
American
among
amount
analysis
and
animal
another
answer
any
anyone
anything
appear
apply
approach
area
argue
arm
around
arrive
art
article
artist
as
ask
assume
at
attack
attention
attorney
audience
author
authority
available
avoid
away
baby
back
bad
bag
ball
bank
bar
base
be
beat
beautiful
because
become
bed
before
begin
behavior
behind
believe
benefit
best
better
between
beyond
big
bill
billion
bit
black
blood
blue
board
body
book
born
both
box
boy
break
bring
brother
budget
build
building
business
but
buy
by
call
camera
campaign
can
cancer
candidate
capital
car
card
care
career
carry
case
catch
cause
cell
center
central
century
certain
certainly
chair
challenge
chance
change
character
charge
check
child
choice
choose
church
citizen
city
civil
claim
class
clear
clearly
close
coach
cold
collection
college
color
come
commercial
common
community
company
compare
computer
concern
condition
conference
Congress
consider
consumer
contain
continue
control
cost
could
country
couple
course
court
cover
create
crime
cultural
culture
cup
current
customer
cut
dark
data
daughter
day
dead
deal
death
debate
decade
decide
decision
deep
defense
degree
Democrat
democratic
describe
design
despite
detail
determine
develop
development
die
difference
different
difficult
dinner
direction
director
discover
discuss
discussion
disease
do
doctor
dog
door
down
draw
dream
drive
drop
drug
during
each
early
east
easy
eat
economic
economy
edge
education
effect
effort
eight
either
election
else
employee
end
energy
enjoy
enough
enter
entire
environment
environmental
especially
establish
even
evening
event
ever
every
everybody
everyone
everything
evidence
exactly
example
executive
exist
expect
experience
expert
explain
eye
face
fact
factor
fail
fall
family
far
fast
father
fear
federal
feel
feeling
few
field
fight
figure
fill
film
final
finally
financial
find
fine
finger
finish
fire
firm
first
fish
five
floor
fly
focus
follow
food
foot
for
force
foreign
forget
form
former
forward
four
free
friend
from
front
full
fund
future
game
garden
gas
general
generation
get
girl
give
glass
go
goal
good
government
great
green
ground
group
grow
growth
guess
gun
guy
hair
half
hand
hang
happen
happy
hard
have
he
head
health
hear
heart
heat
heavy
help
her
here
herself
high
him
himself
his
history
hit
hold
home
hope
hospital
hot
hotel
hour
house
how
however
huge
human
hundred
husband
I
idea
identify
if
image
imagine
impact
important
improve
in
include
including
increase
indeed
indicate
individual
industry
information
inside
instead
institution
interest
interesting
international
interview
into
investment
involve
issue
it
item
its
itself
job
join
just
keep
key
kid
kill
kind
kitchen
know
knowledge
land
language
large
last
late
later
laugh
law
lawyer
lay
lead
leader
learn
least
leave
left
leg
legal
less
let
letter
level
lie
life
light
like
likely
line
list
listen
little
live
local
long
look
lose
loss
lot
love
low
machine
magazine
main
maintain
major
majority
make
man
manage
management
manager
many
market
marriage
material
matter
may
maybe
me
mean
measure
media
medical
meet
meeting
member
memory
mention
message
method
middle
might
military
million
mind
minute
miss
mission
model
modern
moment
money
month
more
morning
most
mother
mouth
move
movement
movie
Mr
Mrs
much
music
must
my
myself
name
nation
national
natural
nature
near
nearly
necessary
need
network
never
new
news
newspaper
next
nice
night
no
none
nor
north
not
note
nothing
notice
now
number
occur
of
off
offer
office
officer
official
often
oh
oil
ok
old
on
once
one
only
onto
open
operation
opportunity
option
or
order
organization
other
others
our
out
outside
over
own
owner
page
pain
painting
paper
parent
part
participant
particular
particularly
partner
party
pass
past
patient
pattern
pay
peace
people
per
perform
performance
perhaps
period
person
personal
phone
physical
pick
picture
piece
place
plan
plant
play
player
PM
point
police
policy
political
politics
poor
popular
population
position
positive
possible
power
practice
prepare
present
president
pressure
pretty
prevent
price
private
probably
problem
process
produce
product
production
professional
professor
program
project
property
protect
prove
provide
public
pull
purpose
push
put
quality
question
quickly
quite
race
radio
raise
range
rate
rather
reach
read
ready
real
reality
realize
really
reason
receive
recent
recently
recognize
record
red
reduce
reflect
region
relate
relationship
religious
remain
remember
remove
report
represent
Republican
require
research
resource
respond
response
responsibility
rest
result
return
reveal
rich
right
rise
risk
road
rock
role
room
rule
run
safe
same
save
say
scene
school
science
scientist
score
sea
season
seat
second
section
security
see
seek
seem
sell
send
senior
sense
series
serious
serve
service
set
seven
several
sex
sexual
shake
share
she
shoot
short
shot
should
shoulder
show
side
sign
significant
similar
simple
simply
since
sing
single
sister
sit
site
situation
six
size
skill
skin
small
smile
so
social
society
soldier
some
somebody
someone
something
sometimes
son
song
soon
sort
sound
source
south
southern
space
speak
special
specific
speech
spend
sport
spring
staff
stage
stand
standard
star
start
state
statement
station
stay
step
still
stock
stop
store
story
strategy
street
strong
structure
student
study
stuff
style
subject
success
successful
such
suddenly
suffer
suggest
summer
support
sure
surface
system
table
take
talk
task
tax
teach
teacher
team
technology
television
tell
ten
tend
term
test
than
thank
that
the
their
them
themselves
then
theory
there
these
they
thing
think
third
this
those
though
thought
thousand
threat
three
through
throughout
throw
thus
time
to
today
together
tonight
too
top
total
tough
toward
town
trade
traditional
training
travel
treat
treatment
tree
trial
trip
trouble
true
truth
try
turn
TV
two
type
under
understand
unit
until
up
upon
us
use
usually
value
various
very
victim
view
violence
visit
voice
vote
wait
walk
wall
want
war
watch
water
way
we
weapon
wear
week
weight
well
west
western
what
whatever
when
where
whether
which
while
white
who
whole
whom
whose
why
wide
wife
will
win
wind
window
wish
with
within
without
woman
wonder
word
work
worker
world
worry
would
write
writer
wrong
yard
yeah
year
yes
yet
you
young
your
yourself
`
const bankLetters = stringWords.split('\n');

const stringNumbers = `
0
1
2
3
4
5
6
7
8
9
`;
const bankNumbers = stringNumbers.split('\n');

const stringSymbols = `
.
;
:
/
-
'
_
(
)
=
+
@
`
const bankSymbols = stringSymbols.split('\n');

//game values
let gameActive = false;

const roundProperties = [
    {
        round: 1,
        caption: "Just Letters",
        minLetters: 1,
        maxLetters: 1,
        time: 20,
        phrases: 10,
        bank: bankLetters
    },
    {
        round: 2,
        caption: "Tiny Words",
        minLetters: 2,
        maxLetters: 2,
        time: 18,
        phrases: 10,
        bank: bankLetters
    },
    {
        round: 3,
        caption: "Slightly Bigger Words",
        minLetters: 3,
        maxLetters: 3,
        time: 22,
        phrases: 10,
        bank: bankLetters
    },
    {
        round: 4,
        caption: "Ramping Up",
        minLetters: 3,
        maxLetters: 4,
        time: 22,
        phrases: 10,
        bank: bankLetters
    },
    {
        round: 5,
        caption: "Introducing Numbers",
        minLetters: 1,
        maxLetters: 1,
        time: 20,
        phrases: 10,
        bank: bankNumbers
    },
    {
        round: 6,
        caption: "Chunky Bois",
        minLetters: 3,
        maxLetters: 6,
        time: 25,
        phrases: 10,
        bank: bankLetters
    },
    {
        round: 7,
        caption: "Getting There",
        minLetters: 4,
        maxLetters: 8,
        time: 25,
        phrases: 10,
        bank: bankLetters
    },
    {
        round: 8,
        caption: "A Little Faster Now",
        minLetters: 5,
        maxLetters: 9,
        time: 22,
        phrases: 10,
        bank: bankLetters
    },
    {
        round: 9,
        caption: "Even Faster",
        minLetters: 7,
        maxLetters: 12,
        time: 22,
        phrases: 10,
        bank: bankLetters
    },
    {
        round: 10,
        caption: "Numbers - The Sequel",
        minLetters: 1,
        maxLetters: 1,
        time: 15,
        phrases: 10,
        bank: bankNumbers
    },
    {
        round: 11,
        caption: "Anything Goes",
        minLetters: 6,
        maxLetters: 99,
        time: 15,
        phrases: 5,
        bank: bankLetters
    },
    {
        round: 12,
        caption: "Anything Goes",
        minLetters: 6,
        maxLetters: 99,
        time: 14,
        phrases: 5,
        bank: bankLetters
    },
    {
        round: 13,
        caption: "Anything Goes",
        minLetters: 6,
        maxLetters: 99,
        time: 13,
        phrases: 5,
        bank: bankLetters
    },
    {
        round: 14,
        caption: "Anything Goes",
        minLetters: 6,
        maxLetters: 99,
        time: 12,
        phrases: 5,
        bank: bankLetters
    },
    {
        round: 15,
        caption: "Numbers 3: Revolutions",
        minLetters: 1,
        maxLetters: 1,
        time: 8,
        phrases: 5,
        bank: bankNumbers
    },
    {
        round: 16,
        caption: "Anything Goes",
        minLetters: 6,
        maxLetters: 99,
        time: 10,
        phrases: 5,
        bank: bankLetters
    }
];

//settings
const spacesAllowed = true;

//message transmission
function clearMessage() {
    $("#message-english").html("");
    $("#message-morse").html("");

    $("#transmitter").removeData();
}

function transmitDot() {
    $("#message-morse").append(dotChar);
}

function transmitDash() {
    $("#message-morse").append(dashChar);
}

function transmitLetterSeparator() {
    $("#message-morse").append("\xa0\xa0");
}

function transmitSpace() {
    $("#message-morse").append("\xa0\xa0" + spaceChar + "\xa0\xa0");
}

function buttonSetState(press) {
    const button = $("#transmitter");
    clearTimeout(button.data("timeout"));

    if (press) {
        toneMorse.start();

        if (!button.data("state")) {
            //initial press
            button.data("startTime", new Date()); //start timer

            //dash
            button.data("timeout", setTimeout(function() {
                if (button.data("state")) {
                    transmitDash();
                }
            }, dotDuration));

            if (typeof button.data("endTime") != "undefined") {
                const ms = button.data("startTime") - button.data("endTime");
                if (spacesAllowed && ms >= spaceDuration) {
                    transmitSpace();
                } else if (ms >= letterSeparatorDuration) {
                    transmitLetterSeparator();
                }
            }
        }
        button.addClass("pressed");
    } else {
        toneMorse.stop();

        if (button.data("state")) {
            //release
            button.data("endTime", new Date()); //end timer
            const ms = button.data("endTime") - button.data("startTime");

            if (ms <= dotDuration) {
                transmitDot();
            }

            button.data("timeout", setTimeout(
                function(){
                    parseMorse();
                }, letterSeparatorDuration)
            );
        }
        button.removeClass("pressed");
    }
    button.data("state", press);
}

function parseMorse() {
    const morse = $("#message-morse").text().split(" ");
    let text = "";
    morse.forEach(function(item){
      switch (item) {
        case "": //do nothing
          break;
        case spaceChar:
          text += " "; //new word
          break;
        default:
          const value = getKeyByValue(morseTable, item);
          if (value) {
            text += value;
          } else {
            text += "?"; //unknown character
          }
      }
    });

    $("#message-english").html(text);

    if (gameActive) {
        //check last entered letter
        const lastLetter = text.slice(-1);
        const challengeLetter = $(".challenge-letter.incomplete:first");

        if (lastLetter == challengeLetter.text()) {
            streakAdd();
            challengeLetter.removeClass("incomplete").addClass("complete");

            if ($(".challenge-letter.incomplete").length == 0 && $(".challenge-letter.complete").length >= 1) {
                phraseEnd();
            }
        } else {
            streakReset();
        }
    }
}

//game
function gameSetSpan(spanClass) {
    $("#game > span").hide();
    $("#game > span." + spanClass).show();
}

function gameInit() {
    const game = $("#game");
    game.removeData();
    game.data("round", 0);
    game.data("phrasesLeft", 0);
    game.data("score", 0);
    game.data("timeRemaining", 0);
    game.data("streak", 0);
    gameSetSpan("start");

    gameActive = true;

    $("#score-submit").removeAttr("disabled");
}

function gameStart() {
    gameInit();
    roundStart(startingRound);
}

function roundStart(round) {
    const game = $("#game");
    game.data("round", round);

    const roundProperties = getRoundProperties();

    //show/populate round intro
    gameSetSpan("round-intro");
    $(".round-number").html(game.data("round"));
    $("#round-caption").html(roundProperties.caption);
    updateStreak();
    clearMessage();

    game.data("phrasesLeft", roundProperties.phrases);
    startCountdown(3, roundShowPhrase, false);

    //start intro rythmn
    toneRailroad.start();
}

function phraseEnd() {
    const game = $("#game");
    const timeRemaining = game.data("timeRemaining");
    const round = game.data("round");
    const streak = game.data("streak");

    //play sound
    toneDing.start();

    //calculate scoring
    const basePoints = 100 + (round - 1) * 10;
    const timeBonus = Math.floor(timeRemaining * 5);

    //calculate streak bonus
    let streakBonus = 0;
    const minStreakBonus = 3;
    if (streak >= minStreakBonus) {
        streakBonus = (streak - minStreakBonus + 1) * 20;
        const log = `Streak Bonus: +${streakBonus} points!!`;
        $("#log").html(log);
    }

    const totalPoints = basePoints + timeBonus + streakBonus;

    //update score
    let score = game.data("score");
    score += totalPoints;
    game.data("score", score);
    updateScore();

    //pause timer
    stopBar();

    //advance to next phrase/round
    setTimeout(function(){
        let phrasesLeft = game.data("phrasesLeft");
        if (phrasesLeft == 0) {
            //advance to next round
            let round = game.data("round") + 1;
            roundStart(round);
        } else {
            game.data("phrasesLeft", --phrasesLeft);
            roundShowPhrase();
        }
    }, 1000);
}

function streakReset() {
    $("#game").data("streak", 0);
    updateStreak();
}

function streakAdd() {
    let streak = $("#game").data("streak");
    streak++;
    $("#game").data("streak", streak);
    updateStreak();
}

function updateStreak() {
    const streak = $("#game").data("streak");
    $("#round-streak").html(streak);
}

function getRoundProperties() {
    let round = $("#game").data("round");

    //set round limit
    const maxRound = Math.max.apply(Math, roundProperties.map(function(e){return e.round}));
    if (round > maxRound) {
        round = maxRound;
    }

    return roundProperties.filter(function(e){
        return e.round == round;
    })[0];
}

function getScore() {
    return parseInt($("#game").data("score"));
}

function gameOver() {
    gameActive = false;

    //update display
    $("div.progress").hide();
    gameSetSpan("gameover-screen");
    clearMessage();

    if (getScore() > 0 && (user)) {
        submitUserScore();
    }
}

function submitUserScore() {
    if (user) {
        const toastSaving = generateToast("Submitting score...", false, false);

        //update user game data
        const userID = user._id;
        const gameID = "morse_transmission";

        getGameData(userID, gameID)
          .then(gameData=>{
            //initialize property if new
            if (gameData === null) {
                gameData = {score: 0};
            }
            //update score if higher
            if (getScore() > gameData.score) {
                gameData.score = getScore();
            }
            return setGameData(userID, gameID, gameData);
          })
          .then(()=>{
            return getScores(gameID);
          })
          .then(scores=>{
            //find rank from score list
            const isPlayer = (score)=>{
              return score.userID == userID;
            }
            const rank = addOrdinalSuffix(scores.find(isPlayer).rank);

            toastSaving.toast("dispose");
            generateToast(`Congratulations! You are ${rank} on the leaderboards. <a href="/scores">Jump to scores</a>`, true, 20000);
          })
          .catch(err=>{
            console.log(err);
            toastSaving.toast("dispose");
            generateToast("An unexpected error occured.", true, 20000);
          });
    }
}

function convertAlphabetic(str) {
    return str.replace(/[^A-Za-z]/g, '');
}

function roundShowPhrase() {
    const roundProperties = getRoundProperties();

    //stop railroad tone
    toneRailroad.stop();

    //update display
    gameSetSpan("round-challenge");
    updateScore();
    $("#round-phrases").html($("#game").data("phrasesLeft"));
    clearMessage();
    $("#log").html("");

    //start timer
    startCountdown(roundProperties.time, gameOver, true);

    //populate challenge phrase
    const challengePhrase = selectPhrase(roundProperties);
    $("#challenge-phrase").empty();
    for (let i = 0; i < challengePhrase.length; i++) {
        const letter = challengePhrase.charAt(i);
        $("#challenge-phrase").append("<span class='challenge-letter incomplete'>" + letter + "</span>");
    }
}

function startCountdown(seconds, nextFunction, showTimeRemaining) {
    const bar = $("#timer");

    //initialize interval object
    initBar();
    $("div.progress").show();

    const startTime = new Date();
    let progress = 100;
    setBarPosition(progress);

    const intervalObj = setInterval(function(){
        //check how much time has elapsed
        const endTime = new Date();
        const secondsElapsed = (endTime - startTime) / 1000;
        const secondsRemaining = (seconds - secondsElapsed);
        progress = (secondsRemaining / seconds) * 100;
        $("#game").data("timeRemaining", secondsRemaining);

        //display time
        if (showTimeRemaining) {
            setBarText(`${secondsRemaining.toFixed(2)} seconds left`);
        }

        //check for limits
        if (progress < 0) {
            progress = 0;
        } else if (progress > 100) {
            progress = 100;
        }
        setBarPosition(progress);

        if (progress <= 0) {
            stopBar();
            nextFunction();
        }

        //railroad sound
        if (toneRailroad.state === "started") {
          //parameters
          const upper = +15;
          const lower = -30;
          const fadeProgress = 50;

          //working
          let scale = (progress >= fadeProgress) ? 1 : (progress / fadeProgress);
          if (scale > 1) {
            console.log("WARNING: APPLYING SOUND LIMIT");
            scale = 1;
          }

          toneRailroad.volume.value = lower + scale * Math.abs(upper - lower);
        }
    }, countdownUpdateInterval);

    bar.data("interval", intervalObj);
}

function initBar() {
    setBarPosition(0);
    setBarText("");
    stopBar();
}

function stopBar() {
    clearInterval($("#timer").data("interval"));
}

function setBarText(text) {
    $("#timer").html(text);
}

function setBarPosition(percentage) {
    $("#timer").css({
        width: percentage + "%"
    });
}

function updateScore() {
    const score = $("#game").data("score");
    $(".score").html(score);
}

function selectPhrase(roundProperties) {
    let phrase;

    const validPhrases = roundProperties.bank.filter(function(e){return e.length >= roundProperties.minLetters && e.length <= roundProperties.maxLetters});

    if (validPhrases.length == 0) {
        phrase = bank[getRndInteger(0, phrases.length)];
        console.log("Warning: No applicable phrases found. Selecting random entry.");
    } else {
        phrase = validPhrases[getRndInteger(0, validPhrases.length)];
    }

    //format phrase
    phrase = phrase.toUpperCase();

    return phrase;
}

$(function(){
    //initialize
    addOptionsMenu(["volume"]);
    buttonSetState(false);
    gameInit();
    warnUserLogin();

    //user mouse input
    $("#transmitter").mouseup(function() {
        buttonSetState(false);
    }).mousedown(function(){
        buttonSetState(true);
    });

    //user keyboard input
    const keycodeBackspace = 8;
    const keycodeDelete = 46;
    const keycodeSpacebar = 32;
    const keycodeM = 77;

    document.body.onkeyup = function(e) {
        switch (e.keyCode) {
            case keycodeSpacebar:
            case keycodeM:
                buttonSetState(false);
                break;
        }
    }

    document.body.onkeydown = function(e) {
        switch (e.keyCode) {
            case keycodeBackspace:
            case keycodeDelete:
                clearMessage();
                e.preventDefault();
                break;
            case keycodeSpacebar:
            case keycodeM:
                buttonSetState(true);
                e.preventDefault();
                break;
        }
    }
});
