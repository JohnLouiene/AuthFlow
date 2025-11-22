```less
[Client / Browser / Frontend]
           |
           |  HTTP Request (GET /users or POST /login)
           v
[Express app.js]
  ├─ Middleware: app.use(express.json())  ← parses JSON body
  └─ Router Mount: app.use("/users", userRoutes)
           |
           v
[routes/users.js]  ← Router handles user-related routes
  ├─ router.get("/", ...)        ← calls getUsers()
  ├─ router.get("/ids", ...)     ← calls getUserIds()
  └─ router.post("/login", ...)  ← calls authenticateUser()
           |
           v
[models/User.js]  ← Model layer handles DB logic
  ├─ getUsers()        → pool.query("SELECT * FROM users")
  ├─ getUserIds()      → pool.query("SELECT id FROM users")
  └─ authenticateUser() → pool.query("SELECT * FROM users WHERE username = $1")
           |
           v
[models/db.js]  ← Pool layer manages DB connections
  └─ pg.Pool object
      └─ Maintains a pool of open PostgreSQL connections
           |
           v
[PostgreSQL Database]
  ├─ users table: id, username, hashed password, etc.
  └─ Executes SQL query and returns results
           |
           v
Back up the chain:
  └─ pool.query() returns rows → Model function returns data → Route handler sends JSON → Client receives response
```