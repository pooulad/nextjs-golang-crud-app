# nextjs-golang-crud-app
🚨Simple full-stack project with nextjs and golang

The purpose of creating this project is to learn for junior programmers how to implement a full stack application and create the best structure for the application.
![HomePage](https://github.com/pooulad/nextjs-golang-crud-app/blob/main/images/home.png)

## Technology list in this project

in back-end:
 - Fiber
 - JWT token
 - Validator
 - Godotenv
 - Paginate
 - Postgres
 - GORM


in front-end:
 - React hook form
 - Axios
 - React-toastify
 - Tailwindcss
 - Typescript
 - Next-auth


## How to run

🚦I included the .env file intentionally in the project so that you can see how the services work and with what settings. Otherwise, it should not be displayed in the project.

With Docker🐳:

1-Run DB and API service
```bash
  docker compose up -d
```
2- Run nextjs
```bash
  cd ./frontend
  yarn install
  yarn run dev
```

Manaul✌️:

1-Create DB based on .env file(you can change it in .env file)

2-In root of source you should run your go project
```bash
  go mod tidy
  go run main.go
```
or- live refresh with air.

- install air
```bash
  go install github.com/air-verse/air@latest
```
- then run:
```bash
  air
```

3-In root frontend directory you should run your next project
```bash
  yarn install
  yarn run dev
```

## API Reference

#### Local address
```bash
  http://127.0.0.1:8080
```
#### All endpoints

```http
  GET /api/users -> get all users
  POST /api/user -> create new user
  PATCH /api/user/:id -> update user
  GET /api/user/:id -> get single user
  DELETE /api/user/:id -> delete user
  POST /api/login -> login to account
```

#### TODO Checklist

This section tracks the progress of implemented features in project.

- [x] Add swagger to project.
- [x] Add Next-auth to project -> frontend directory.
- [x] Add all api response states(success,failure).
- [x] Dockerize project.

## Screenshots

![App SignUp Form](https://github.com/pooulad/nextjs-golang-crud-app/blob/main/images/sign-up.png)

![App SignIn Form](https://github.com/pooulad/nextjs-golang-crud-app/blob/main/images/sign-in.png)


## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=pooulad/nextjs-golang-crud-app&type=Date)](https://star-history.com/#pooulad/nextjs-golang-crud-app&Date)
