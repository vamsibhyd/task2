
### 🧪 Task 2: Profile Scraper

- Takes a list of LinkedIn profile URLs from `urls.json`
- Automatically opens each profile (in background tabs)
- Extracts:
  - Name
  - Bio
  - About section
  - Location
  - Follower & Connection counts
  - Profile URL
- Sends scraped data to a local backend via POST API (`/api/profiles`)

---

### 🤖 Task 3: Feed Interaction Automation

- Adds two input fields in the extension popup:
  - `Like Count`
  - `Comment Count`
- Enables “Start Interaction” button only after valid inputs
- Opens the LinkedIn feed and:
  - Likes a random set of posts (up to `Like Count`)
  - Posts a generic comment like **"CFBR"** on a set of posts (up to `Comment Count`)
- Uses `execCommand("insertText")` to simulate real typing, so LinkedIn enables the "Post" button
- 
