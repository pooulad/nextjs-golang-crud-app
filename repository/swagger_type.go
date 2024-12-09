package repository

type LoginRequest struct {
    Username string `json:"username" example:"john_doe"`
    Password string `json:"password" example:"securepassword123"`
}

type LoginResponseOK struct {
    Token string `json:"token" example:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."`
}

type LoginResponseFailure struct {
    Message string `json:"message" example:"Invalid username or password"`
    Data    string `json:"data,omitempty" example:""`
}