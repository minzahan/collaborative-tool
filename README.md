# Collaborative-tool
This project is a real-time collaborative editing application built with React, FastAPI, MongoDB, and Socket.IO. It enables users to create and join collaborative editing sessions, edit documents together in real time, and manage participants dynamically. The tool is designed for teams to work together.

# Prerequisites
- Docker
- Node.js

# Build and start the App

```
docker compose up --build
```

# Access the App

```
http://localhost:3000
```
# Access the Database

```
docker exec -it collaborative-tool-mongodb mongosh
```
# Functionality Overview
- Create collaboration sessions.
- Join existing sessions using a session ID.
- Real-time updates for document content and participant lists.
- End sessions by document owners and persist participants as collaborators.
- Leave sessions for collaborators, and remove them from active participants.

