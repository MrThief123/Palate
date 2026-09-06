# 🍽️ Palate

### Your recipes. Your preferences. Your AI.

**Palate** is an AI-powered personalised recipe discovery platform that learns what you like and remembers your preferences over time.

Instead of repeatedly searching for recipes and filtering through hundreds of irrelevant results, Palate uses **persistent user memory** to understand your tastes, cooking ability, available time, dietary requirements, and previous interactions — creating an increasingly personalised recipe experience.

---

## ✨ Features

### 🧠 Personalised AI Recommendations

Palate learns from each user's interactions and preferences to recommend recipes that are relevant to their individual tastes.

### 👆 Tinder-Style Recipe Discovery

Browse recipes through an intuitive swipe-based interface:

* 👉 Swipe right to save recipes you like
* 👈 Swipe left to skip recipes
* ❤️ Build a personalised collection over time

Every interaction provides additional context for Palate's recommendations.

### 🧑‍🍳 Personalised Onboarding

When users first join Palate, they can provide information such as:

* Foods they enjoy
* Foods they dislike
* Cooking experience
* Available cooking time
* Dietary preferences
* Allergies and restrictions

This creates an initial preference profile that the AI can use immediately.

### 💭 Persistent AI Memory

Palate doesn't treat every interaction as a new conversation.

The system maintains relevant information about the user so recommendations can become more personalised over time.

For example:

> A user repeatedly saves quick vegetarian meals.

Palate can use this behaviour as context for future recommendations, rather than simply looking at the user's latest request.

### 🔐 Google Authentication

Users can securely sign in using their Google account and maintain their personalised profile and recipe history.

---

# 🏗️ Architecture

```text
                         ┌─────────────────────┐
                         │      User           │
                         │                     │
                         │  Swipe / Discover   │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │      React          │
                         │     Frontend        │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   Node.js Backend   │
                         │                     │
                         │  API + AI Logic     │
                         └───────┬─────┬───────┘
                                 │     │
                    ┌────────────┘     └────────────┐
                    ▼                               ▼
          ┌─────────────────┐             ┌─────────────────┐
          │   CockroachDB   │             │ Amazon Bedrock  │
          │                 │             │                 │
          │ Users           │             │ Palate AI Agent │
          │ Preferences     │             │                 │
          │ Memories        │             │ Recommendations │
          └─────────────────┘             └────────┬────────┘
                                                   │
                                                   ▼
                                         ┌─────────────────┐
                                         │    Amazon S3    │
                                         │                 │
                                         │ Recipe Data     │
                                         └─────────────────┘
```

---

# 🧰 Tech Stack

| Technology         | Purpose                                   |
| ------------------ | ----------------------------------------- |
| **React**          | Frontend application                      |
| **Node.js**        | Backend/API layer                         |
| **CockroachDB**    | Persistent user data and AI memory        |
| **Amazon Bedrock** | AI agent and personalised recommendations |
| **Amazon S3**      | Recipe data storage                       |
| **OpenAI APIs**    | AI-powered functionality                  |
| **PostgreSQL**     | Relational data management                |
| **Google OAuth**   | User authentication                       |

---

# 🧠 Agentic Memory

One of Palate's key concepts is **persistent AI memory**.

Traditional recommendation systems may primarily rely on a user's immediate query or a static preference profile.

Palate instead maintains a continuously evolving understanding of the user.

### Example

A user might initially say:

```text
"I like Italian food."
```

Over time, their interactions might show:

```text
✓ Saves pasta recipes
✓ Likes vegetarian meals
✓ Skips recipes requiring >30 minutes
✓ Frequently chooses spicy dishes
```

Palate can combine these signals into a richer understanding of the user's preferences.

The next time the user opens the app, recommendations can reflect this accumulated context.


---

# 🚀 Getting Started

## Prerequisites

Make sure you have installed:

* Node.js
* npm
* Git

You will also need access to the relevant:

* CockroachDB database
* Amazon S3 bucket
* Amazon Bedrock services
* Google OAuth credentials
* AI API credentials


# 📱 🎯 Why Palate?

Finding recipes shouldn't feel like searching a database.

Most recipe platforms require users to repeatedly specify what they want:

> "I want something vegetarian, quick, spicy and Italian."

Palate aims to make this implicit.

The more someone uses Palate, the better it understands them.

### **Discover → Interact → Remember → Personalise**

That's the core feedback loop behind the application.

---



---

# 🔮 Future Improvements

Potential future features include:

* 🍳 AI-generated recipes
* 🛒 Automatic shopping lists
* 📅 Weekly meal planning
* 🧾 Nutrition and calorie tracking
* 👨‍👩‍👧 Household preference profiles
* 🧠 More sophisticated long-term memory
* 🔍 Natural-language recipe search
* 📊 Recommendation analytics
* 🔄 Feedback-driven recommendation models
* 📱 Native mobile application



---

## ⭐ The Vision

**Palate isn't just a recipe search engine.**

It's a recipe companion that gets to know you.

> **The more you use Palate, the better it knows your taste.**
