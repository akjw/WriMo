# WriMo
SEI Project 2

## Technologies

1. Node
2. Express
3. MongoDB
4. HTML/CSS/JavaScript

## Description
November is National Novel Writing Month (aka NaNoWriMo). WriMo seeks to encourage writers to write more--even outside of NaNoWriMo. WriMo is a web application that allows users to read and post writing, as well as give and receive feedback on their work. 


## Approach
I wanted main navigation links for works/prompts/tags, and built my database around the main models of User/Work/Prompt.


### User stories
``` text
As a writer, I want to be able to browse prompts 
    so that I can choose prompts to respond to.
As a writer, I want to post/edit works 
    so that I can get feedback.
As a writer, I want to create new prompts 
    so that other writers can post responses.
As a reader, I want to sort prompts & works (e.g. by comments, favorites, or date posted)
    so I can better control what I see.
As a reader, I want to favorite/bookmark a work I enjoy 
    so I can return to it in future.
As a reader, I want to comment on a work 
    so I can express appreciation for the writer/offer feedback.
As a reader, I want to search for a work/prompt/user by name.

```

### Wireframe / Relational Flow
<img width="50%" src='/misc/user-flow.jpg' />



## Install
Access online at http://wrimo.herokuapp.com/

## Future Features
- Allow writers to post multi-chapter works
- A direct message feature built with socket.io

## Credits
WriMo's main functionalities are inspired by <a href="https://github.com/otwcode/otwarchive">Archive of Our Own</a>, an online archive of original and transformative works. 