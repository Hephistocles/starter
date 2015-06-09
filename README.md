# Starter Pack

A starter pack for web-dev projects, saving me from needing to set everything up from scratch each time. It aims to be slightly more lightweight than some of the other skeleton packages (or perhaps just better tailored to my own needs).

Included:

- Node + Express for the server side.
- Angular + Bootstrap for the client side
- Sass + Jade for client generation
- Grunt with JSHint, Nodemon, and LiveReload for development
- Premade config files for the above, git, npm, Bower and Sublime Text
- Tidy directory structure

The server component is split up into an API half and a client-serving half. The expectation is that the API implementation will be the more interesting part of the server, and that the app half will largely be left as-is.

## Installation

Fork or download the project by clicking the appropriate button above. You may like to modify the following places to reflect your project info:

- about.json (N.B. both bower.json and package.json read from here)
- rename starter.sublime-project

## Usage

Use `grunt build` to compile all client files (Jade, Sass, etc) into the `${project}/build` directory. This will also clean any previous results.
Use `grunt` by itself to build as above and also start up the node server. The server is started with nodemon, so it will restart every time a change is detected. Grunt will also watch src directories and trigger a refresh in the client page if you have the appropriate extension installed.
Use `grunt dev` to build and start the server as above, and also start node-inspector to debug your server JavaScript.

### Client
The built files follow the same structure as found in `src/client`, with the exception that jade files will be placed directly in the build directory root. The app server serves files directly from `/build`, so to add "localhost:3000/newpage.html" to your app, simply create `src/client/jade/newpage.jade`. The HTML structure is up to you, but `index.jade` has a fairly handy minimal header to start with. You're pretty much in control for `client/js` and `client/sass` too. For tidiness, I've preferred to keep library Sass in a separate file (included from `lib.css`).

Most of this library code will likely be coming from bower. If that's the case, you should add an entry to the dependencies section of `bower.json`. You will also need to tell Grunt to copy the right files to the build directory. You can do that by editing around line 60 of `Gruntfile.js`.

### Server
You can probably ignore helper.js. It does some handy wrapping of the API module. New API routes can be added near the top of main.js. To use the handy shortcut wrappers, use something like the following: 
    
    app.get([route], api.express.[api_method]([param_name1], [param_name2], ...)
The parameter names are looked up first in `req.params`, then in `req.body` and finally in `req.body`. If you need anything more complex than that, you write your own callback using `api.[api_method]` directly.
    
Implementation for these API methods can be put anywhere, but for tidiness I'd put them inside the `api` directory. I expect the implementations to return promises, but they can return static values if you like (the handy wrapping ensures only promises reach `main.js`). Finally, `server/api.js` defines where the implementations are stored, and wraps them as described above. You shouldn't need to do much here.