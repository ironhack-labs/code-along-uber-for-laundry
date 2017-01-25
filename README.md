![Ironhack Logo](https://i.imgur.com/1QgrNNw.png)

# PP | Basic Auth with Uber For Laundry

## Learning Goals
- Add basic user authentication to an Express application.
- Create sessions in an Express application.
- Store user information in the session and use it in some routes. 
- Prevent anonymous (logged out) users from accessing parts of your application.


## Requirements

- [Fork this repo](https://guides.github.com/activities/forking/)
- Clone your fork into your `~/code/labs` folder.


## Submission

Upon completion, run the following commands
```
$ git add .
$ git commit -m "done"
$ git push origin master
```
Navigate to your repo and create a Pull Request -from your master branch to the original repository master branch.

In the Pull request name, add your name, last names and campus city separated by hyphens `-`.


## Deliverables

All the files in the `starter-code/` folder that make your Express app work.


## Introduction

Let's face it: **everybody has to do laundry**. Even Batman.

![](https://media.giphy.com/media/EvNfyRC5HMVzi/giphy.gif)

Laundry takes so much of our time. Don't even get me started on _folding_. It's often tempting to just not do it. Go out in dirty clothes. Who will know?

Until the day when we we all have robots to do our laundry for us, we have to do it ourselves.

![](https://media.giphy.com/media/dbUbXn2rbivUQ/giphy.gif)

_Or do we?_

What if we could make an app in which we could have **other people do our laundry** for us. No, that's not what your mother is for. I'm talking about strangers with a lot of time on their hands that want to make some extra money on the side. Regular people like you or me!

Let's create an app solve the working professional's laundry problem using Express, bcrypt and sessions. Maybe we really _will_ become Uber for Laundry!

The app will allow users to register and schedule a laundry pickup. They will be able to:

1. Register as a user.
2. Login.
3. Optionally become a launderer.
4. See the list of launderers.
5. Schedule a laundry pickup with a launderer.
6. As launderers, see their pending pickups.


### Starter Code

Starter code breakdown

```
starter-code/
├── .gitignore
└── ...
```

Now that we know what we are starting with, let's get to coding!


## Iteration #1: Register

Registration

### Steps to follow

1. Register users.

### Hints

Bcrypt and stuff.


## Iteration #2: Login

Login

### Steps to follow

1. Log users in.

### Hints

Sessions and stuff.


## Iteration #3: Become a launderer

Make them launderers

### Steps to follow

1. Find a user and make them a launderer.

### Hints

Mongo and stuff.


## Iteration #4: List launderers

List all them launderers

### Steps to follow

1. Find all them launderers.

### Hints

Find queries and stuff.


## Iteration #5: Schedule a laundry pickup

Schedule a pickup

### Steps to follow

1. Make a new pickup.

### Hints

Models and stuff.


## Iteration #6: Pending pickups

Pickups are pending!

### Steps to follow

1. Query things.

### Hints

Queries and queries and stuff.


# That's it!