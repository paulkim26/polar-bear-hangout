# Polar Bear Hangout

## Introduction
Polar Bear Hangout is a online educational platform designed to teach [Scouting](https://en.wikipedia.org/wiki/Scouting) skills in an engaging and effective manner to Boy Scouts, Girl Scouts, Troop leaders, and anyone interested in learning:

- Morse Code
- Cryptography

Polar Bear Hangout was developed in response to the [COVID-19](https://www.who.int/emergencies/diseases/novel-coronavirus-2019) pandemic as a supplement to Boy/Girl Scout programs in a safe, socially-distanced environment.

Currently hosted on [Heroku](https://polarbearhangout.herokuapp.com/).

## Setup
1. Install [Node.js](nodejs.org) `v.14` or later on your local development environment.
2. Clone this repository.
3. Create a local environment variable file named `.env` in this repository's root directory. Add a key named `MONGODB` with the Polar Bear Hangout MongoDB connection string as its value.
```
MONGODB=<insert MongoDB connection string here>
```
4. Install all requisite [npm](https://www.npmjs.com/) packages with the `npm i` command.
5. Run with the `npm start` command.

## Pending Tasks

### New Games & Features
- Nonograms
- Semaphore
- Trivia
- Online chat lobby

### Morse Code
- Online multiplayer real-time game/trainer
- Game: transmit a pre-determined phrase in X minutes
- Morse code reference on side bar
- Tutorials
- Add tone frequency option to Morse Code Transmission game

### Cryptograms
- Get phrases API
- Show letter counts
- Add new puzzles

### User Account Management
- Implement SSO
- Option to purge account data
- Option to reset progress

### User Engagement
- Gamificiation
- Profile cards
- Achievements

### Bugs
- Can't logout in multiplayer page

### Miscellaneous
- Mobile support
- Test on FireFox, Edge
- About page
- Switch to React/Vue framework
- Dark theme
- Remember client page settings (volume, scores table selection)
