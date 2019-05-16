# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allow users to shorten long URLs.
And users logged in can access to their own database and features of the app.

## Final Product

!["Main page"](https://github.com/kcchaha/TinyApp/blob/master/docs/Main%20page.png)
!["Login page"](https://github.com/kcchaha/TinyApp/blob/master/docs/Login%20page.png)
!["Register page"](https://github.com/kcchaha/TinyApp/blob/master/docs/Register%20page.png)
!["User page"](https://github.com/kcchaha/TinyApp/blob/master/docs/User%20page.png)

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

## Getting Started

- Clone this repo to your local file (git clone [repo http url]).
- Open `express_server.js`.
- Turn on your vagrant machine in your termianl (`vagrant up` -> `vagrant ssh`), all the following commands need to be invoked in your terminal.
- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.
- Alternate command for running the server: `npm start`.
- If the port has already been used, quit all your browsers and restart, do `npm start` again before you reopen your browser.