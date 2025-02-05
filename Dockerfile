FROM focker.ir/golang:1.22

WORKDIR /app

COPY go.mod go.sum ./
COPY .env ./
RUN go mod download && go mod verify

COPY . .
RUN go build -v -o main .

EXPOSE 8000

CMD ["/app/main"]