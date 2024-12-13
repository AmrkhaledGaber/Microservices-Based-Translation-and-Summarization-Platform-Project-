CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
);

CREATE TABLE Sessions (
    session_id UUID PRIMARY KEY,
    user_id INT REFERENCES Users(id),
    expiration TIMESTAMP NOT NULL
);

CREATE TABLE Logs (
    request_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(id),
    input_text TEXT,
    output_text TEXT,
    timestamps TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
