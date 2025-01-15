CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    role VARCHAR(50) NOT NULL
);

CREATE TABLE folders (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    user_id BIGINT NOT NULL REFERENCES users(id)
);

CREATE TABLE notes (
    id BIGSERIAL PRIMARY KEY,
    file_path VARCHAR(255) NOT NULL,
    is_private BOOLEAN NOT NULL,
    folder_id BIGINT NOT NULL REFERENCES folders(id)
);

CREATE TABLE comments (
    id BIGSERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    note_id BIGINT NOT NULL REFERENCES notes(id),
    user_id BIGINT NOT NULL REFERENCES users(id)
);