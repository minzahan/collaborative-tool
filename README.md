# Collaborative-tool
This project is a real-time collaborative editing application built with React, FastAPI, MongoDB, and Socket.IO. It enables users to create and join collaborative editing sessions, edit documents together in real time, and manage participants dynamically. The tool is designed for teams to work together.

# Prerequisites
- Docker
- Node.js

# Build and start the App
- clone project and cd into root directory

```
docker compose up --build
```

# Access the App

```
http://localhost:3000
```
# Access the Database and See MongoDB documents for Users and Documents Collection

```
docker exec -it collaborative-tool-mongodb mongosh
```
```
use admin
```
```
db.auth("root","rootpassword")
```
```
use collaborative_tool
```
```
db.users.find().pretty()
```
```
db.documents.find().pretty()
```

# Functionality Overview
- Create collaboration sessions.
- Join existing sessions using a session ID.
- Real-time updates for document content and participant lists.
- End sessions by document owners and persist participants as collaborators.
- Leave sessions for collaborators, and remove them from active participants.

