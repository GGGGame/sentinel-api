# SentinelAPI

**SentinelAPI** is a powerful and flexible **API Gateway** and **API Key Management System** designed to help developers secure, monitor, and manage their APIs with ease. Whether you're building microservices, managing third-party integrations, or scaling your API infrastructure, SentinelAPI provides the tools you need to ensure reliability, security, and performance.

---

## **Features**

### **Core Features**
- **API Gateway**: Centralized management of API requests, including routing, load balancing, and request/response transformation.
- **API Key Management**: Create, revoke, and validate API keys with ease.
- **Rate Limiting**: Protect your APIs from abuse with customizable rate limits.
- **Authentication**: Secure your APIs with JWT
- **Logging**: Centralized logging for all API requests and responses.
- **WebSocket Support**: Real-time updates and communication via WebSockets.

---

## 🚀 **Quick Start**

### 1. **Prerequisites**

- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) installed.
- `.env` file configured.

Create a `.env` file in the project root with the following structure:

## NB: To use SentinelAPI with Docker, you should add the name of the service instead of localhost:
## EX: REDIS_URL=redis://redis:6379

```env
PORT= # The Current port configured in docker is 3030
HOST= # The use of 0.0.0.0 is required because of Fastify and Docker to run in local
DATABASE_URL= # SentinelAPI currently support just PostgreSQL
REDIS_URL= # redis://redis:6379
NODE_ENV= # Development / Production, should be the same in docker-compose.yml
JWT_SECRET= # Secret key of JWT
JWT_EXPIRES_IN= # Expire time of JWT
```

---

### 2. **Build & Run**

Build and start all services:

```sh
docker-compose up --build
```

- API available at: [http://localhost:3030](http://localhost:3030)
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`

---

### 3. **Main Endpoint Structure**

All endpoints are versioned under `/api/v1/`.

#### 👤 **User**
- `POST   /api/v1/user/` — Register user  
  **Body:**
  ```json
  {
    "name": "{name}",
    "password": "{password}",
    "email": "{email}"
  }
  ```
- `POST   /api/v1/user/login` — Login (returns JWT)  
  **Body:**
  ```json
  {
    "password": "{password}",
    "email": "{email}"
  }
  ```
- `GET    /api/v1/user/` — Get user info (authenticated)
- `PUT    /api/v1/user/` — Update user (authenticated)
- `DELETE /api/v1/user/` — Delete user (authenticated)

#### 🔑 **API Key**
- `GET    /api/v1/apikey/` — List user API Keys
- `POST   /api/v1/apikey/` — Create API Key  
  **Body:**
  ```json
  {
    "key": "{key}",
    "name": "{key_name}",
    "userId": {user_id}
  }
  ```
- `PUT    /api/v1/apikey/{id}` — Update API Key  
  **Body:**
  ```json
  {
    "isActive": true
  }
  ```
- `DELETE /api/v1/apikey/{id}` — Delete API Key

**Sample API Key Response:**
```json
{
  "key": "{api_key}",
  "name": "{key_name}",
  "userId": {user_id}
}
```

#### 🚦 **Rate Limit Rules**
- `POST   /api/v1/rules/` — Create a rate limit rule  
  **Body:**
  ```json
  {
    "key": "{key}",
    "type": "{user|ip|endpoint|global}",
    "limit": {limit},
    "window": {window_seconds}
  }
  ```

#### ⚙️ **API Config**
- `GET    /api/v1/apiconfig/` — Get user config
- `POST   /api/v1/apiconfig/` — Create config  
  **Body:**
  ```json
  {
    "transformRequest": {
      "stringToLower": ["email", "password"],
      "stringTrim": ["email", "password"]
    },
    "transformResponse": {
      "hideSensitiveData": ["password"]
    }
  }
  ```
- `PUT    /api/v1/apiconfig/{id}` — Update config
- `DELETE /api/v1/apiconfig/{id}` — Delete config

---

### 4. **Authentication & Headers**

- **JWT**:  
  `Authorization: Bearer <token>`
- **API Key**:  
  `x-sentinel-api-key: <API_KEY>`
- **Rate Limit**:  
  `x-sentinel-limit-rules: <user|ip|path|global>`
- **Transformations**:  
  `x-sentinel-transform: request response`

---

### 5. **Request & Response Validation**

All endpoints require specific fields in the request body.  
**Example bodies above use placeholders** (`{name}`, `{email}`, `{password}`, `{key}`, `{user_id}`, `{id}`) — replace with your actual values.

---

### 6. **Transform Request & Response**

You can enable automatic transformation of request and response data using the `x-sentinel-transform` header and user-specific config.

#### **How to Use**

- **Transform Request**:  
  Add `x-sentinel-transform: request` to your request headers.  
  The API will apply the transformations defined in your user config (e.g., lowercase or trim fields).

- **Transform Response**:  
  Add `x-sentinel-transform: response` to your request headers.  
  The API will apply the transformations defined in your user config (e.g., hide sensitive fields in the response).

#### **Example API Config Body**
```json
{
  "transformRequest": {
    "stringToLower": ["email"],
    "stringTrim": ["email", "password"]
  },
  "transformResponse": {
    "hideSensitiveData": ["password", "secretField"]
  }
}
```
- **stringToLower**: Converts specified fields to lowercase.
- **stringTrim**: Trims whitespace from specified fields.
- **hideSensitiveData**: Removes specified fields from the response.

**Note:**  
- You can combine both request and response transformations by setting `x-sentinel-transform: request response`.
- The fields to transform are defined per user in the `/api/v1/apiconfig/` endpoint.

---

### 8. **CLI**

A CLI (`sentinel`) is under development:

# After building the entire project:
```sh
npm link

sentinel test
```

---