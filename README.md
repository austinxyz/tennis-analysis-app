# 🎾 Tennis Analysis App

A web application for advanced analysis of **UTR** and **USTA** players and matches — helping you scout players, compare teams, and predict outcomes with data-driven insights.

Built with **Vite** for fast performance and scalability.

---

## ✨ Features

### 1. **UTR Matches Analysis**

- View all events organized by **Bay Area Tennis Club**.
- Explore divisions (teams), player lists, and match histories.
- **Player Search:**  
  Find players by name or ID to view their detailed match history.
- **Player Comparison:**  
  Compare two players side by side:
    - UTR ratings
    - Match history
    - Common opponents
    - Predict upcoming match results based on past data.

### 2. **Zijing Cup Analysis**

- View all teams and their members.
- For each team, display the **top 5 pairs** in each line:
    - **Man D1**, **Man D2**, **Man D3**, **Mixed**, and **Women’s Doubles**
- Team comparison tool:
    - Fix players in specific lines.
    - Explore top 5 lineup combinations.
    - Compare lineups and potential match outcomes.

### 3. **USTA Matches Analysis**

- **League Overview:**  
  Browse divisions and flights (currently supports **SB(South Bay)**, **MP(Mid Peninsula)**, **LP(Lower Peninsula)** areas).  
  View teams, players, matches, and detailed player analysis.

- **Candidate Teams:**  
  Review candidate teams with basic info and player lists.

- **Team Search:**  
  Find teams by name. See team details, players, and match records.

- **Player Search:**  
  Look up players by name. View profile, team participation, USTA and UTR matches.

- **Player Finder:**  
  Discover top players by filtering:
    - UTR
    - USTA rating
    - Age range
    - Gender
    - Bay Area

- **Player Statistics:**  
  Analyze player data:
    - UTR range
    - Average UTR
    - And more.

- **Team Analysis:**  
  Compare two teams within the same league:
    - Team score
    - Lineups
    - Historical success rates
    - Top-performing players and pairs

### 4. **Event: Team Building**

- Build teams dynamically.
- Explore potential candidates and top pairs based on event lines and team requirements.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm (comes with Node.js)

### Installation

```bash
git clone https://github.com/austinxyz/tennis-analysis-app.git
cd tennis-analysis-app
npm install
npm run dev
