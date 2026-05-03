# MatdataApp API Documentation

Base URL: `http://localhost:3000/api`

## Endpoints

### 1. Health Check
- **URL:** `/health`
- **Method:** `GET`
- **Description:** Checks if the API is running.
- **Success Response:**
  - **Code:** 200 OK
  - **Content:** `{ "status": "ok", "message": "MatdataApp API is running" }`

### 2. Chatbot Assistant
- **URL:** `/chat`
- **Method:** `POST`
- **Description:** Interact with the AI assistant.
- **Request Body:**
  ```json
  {
    "message": "How do I vote?",
    "language": "en"
  }
  ```
- **Success Response:**
  - **Code:** 200 OK
  - **Content:** `{ "response": "Simulated response from the AI." }`

### 3. Flashcards
- **URL:** `/flashcards`
- **Method:** `GET`
- **Description:** Get all flashcards.
- **Success Response:**
  - **Code:** 200 OK
  - **Content:**
    ```json
    [
      {
        "id": 1,
        "term_en": "Lok Sabha",
        "term_hi": "लोकसभा",
        "definition_en": "The lower house...",
        "definition_hi": "भारत की द्विसदनीय...",
        "category": "Election Basics"
      }
    ]
    ```

## Security
- Rate limited to 50 requests per 15 minutes.
- Uses Helmet for secure HTTP headers.
- CORS enabled for frontend application.
