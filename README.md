# 🌙 Abandonment Garden

**A satirical job search platform exposing the absurdity of modern hiring practices**

---

## 📖 About

Abandonment Garden is a darkly comedic mock job search website that parodies unrealistic job postings, impossible requirements, and corporate culture red flags. With a deadpan serious tone and professional presentation, the site amplifies the humor of absurd expectations like "41 years of experience required" for entry-level positions.

---

## ✨ Features

### Core Functionality
- **User Authentication** - Sign up, log in, and manage multiple accounts
- **Job Search** - Browse 10 hilariously absurd job listings (easily expandable)
- **Save Jobs** - Build your collection of impossible dream jobs
- **Application System** - Apply and receive instant rejection letters
- **Application Tracker** - Monitor your 100% rejection rate with pride
- **Achievement System** - Earn badges for milestones like "100 Rejections Collected"
- **Company Profiles** - Explore fictional companies with massive red flags
- **Reviews & Ratings** - Read and write reviews of terrible employers
- **User Dashboard** - Track applications, saved jobs, and achievements
- **Dark/Light Mode** - Toggle between dystopian dark and sterile light themes

### Satirical Elements
- **Unrealistic Qualifications** - "50 years of experience in 10-year-old technology"
- **Insulting Salaries** - "$18,000/year for Chief Executive Officer"
- **Absurd Benefits** - "Free coffee* (*you bring the coffee)"
- **Impossible Expectations** - "Must be willing to work 24/7/365"
- **Instant Rejections** - Get rejected within seconds of applying
- **Corporate Jargon** - Peak "synergy" and "disruption" overload

---

## 🛠️ Tech Stack

- **HTML5** - Semantic, accessible markup
- **CSS3** - Custom advanced animations (no frameworks)
- **Vanilla JavaScript (ES6+)** - Clean, modular code
- **LocalStorage** - Client-side data persistence
- **JSON** - Job listing database

**⚡ Zero Dependencies - No npm install required!**

---

## 📁 Project Structure
```
Abandonment-Garden/
├── index.html              # Landing page with crying logo
├── README.md               # You are here
├── .gitignore             # Security-rich Git exclusions
│
├── css/                    # Stylesheets
│   ├── main.css           # Core styles & variables
│   ├── animations.css     # Advanced animations
│   ├── themes.css         # Dark/Light mode
│   ├── components.css     # Reusable UI components
│   └── responsive.css     # Mobile responsiveness
│
├── js/                     # JavaScript modules
│   ├── main.js            # App initialization
│   ├── auth.js            # Authentication logic
│   ├── jobs.js            # Job search & management
│   ├── animations.js      # Animation controllers
│   ├── theme.js           # Theme switching
│   └── utils.js           # Helper functions
│
├── pages/                  # HTML pages
│   ├── login.html         # User login
│   ├── signup.html        # Account creation
│   ├── dashboard.html     # User dashboard
│   ├── jobs.html          # Job listings
│   ├── job-details.html   # Individual job view
│   ├── saved-jobs.html    # Saved jobs list
│   ├── applications.html  # Application tracker
│   ├── profile.html       # User profile
│   └── company.html       # Company profiles
│
├── assets/                 # Static assets
│   ├── fonts/             # Custom fonts (empty - ready for additions)
│   ├── icons/             # UI icons (empty - ready for additions)
│   └── images/            # Images (empty - ready for additions)
│
└── data/                   # Data files
    └── jobs.json          # 10 absurd job listings
```

---

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- **That's it!** No Node.js, Python, or package managers required

### Installation

1. **Clone the repository**
```bash
   git clone https://github.com/[your-username]/Abandonment-Garden.git
   cd Abandonment-Garden
```

2. **Choose one of these methods to run:**

#### **Method 1: VS Code Live Server (EASIEST)** ⭐ Recommended
1. Open the project in VS Code
2. Install the **"Live Server"** extension by Ritwick Dey (one-time install)
3. Right-click on `index.html`
4. Click **"Open with Live Server"**
5. Your browser automatically opens to `http://127.0.0.1:5500`

#### **Method 2: Python Local Server**
```bash
# Make sure you're in the project directory
python -m http.server 8000

# Open your browser to:
# http://localhost:8000
```

#### **Method 3: Node.js http-server**
```bash
# Install http-server globally (one-time only)
npm install -g http-server

# Run the server
http-server

# Open your browser to:
# http://localhost:8080
```

#### **Method 4: Direct File Open** (Limited functionality)
- Simply double-click `index.html` in your file explorer
- ⚠️ Note: Some features (like loading jobs.json) may not work due to CORS restrictions

---

## 🎮 Usage

### Creating an Account
1. Click "Sign Up" on the homepage
2. Enter any credentials (multiple accounts allowed)
3. All data is stored locally in your browser

### Searching for Jobs
1. Navigate to the Jobs page
2. Use search bar to filter by keywords
3. Filter by category or sort by salary/date
4. Click any job to view full absurd details

### Applying for Jobs
1. Click "Apply" on any job listing
2. Receive an instant rejection letter with hilarious reason
3. Track all rejections in your Applications dashboard

### Earning Achievements
- Apply to multiple jobs to unlock badges
- Achievements include:
  - "Baby Steps" - First application
  - "Persistent" - 10 applications
  - "Century of Disappointment" - 100 rejections

---

## 🎯 Features to Test

Once the site is running, explore:
- ✅ **Home page** - Crying logo animation with tears
- ✅ **Theme toggle** - Switch between dark/light modes
- ✅ **Sign up** - Create unlimited test accounts
- ✅ **Job browsing** - Search and filter 10 absurd listings
- ✅ **Job details** - Read ridiculous qualifications
- ✅ **Apply** - Get instant rejection with satirical reason
- ✅ **Save jobs** - Build your collection
- ✅ **Dashboard** - View stats and achievements
- ✅ **Applications** - Track your rejection history
- ✅ **Profile** - Manage account info
- ✅ **Company page** - Read terrible reviews

---

## 📝 Adding More Jobs

The site currently includes 10 sample jobs. To add more:

1. Open `data/jobs.json`
2. Follow the existing job object structure:
```json
{
  "id": "job_011",
  "title": "Your Absurd Job Title",
  "company": "Company Name",
  "location": "City, State",
  "category": "Entry Level|Remote|Part-Time|Executive|Technical|Creative|Operations|Sales",
  "salaryMin": 15000,
  "salaryMax": 20000,
  "postedDate": "2025-11-02",
  "description": "Satirical description...",
  "qualifications": ["Impossible requirement 1", "Absurd requirement 2"],
  "responsibilities": ["Unreasonable duty 1", "Ridiculous duty 2"],
  "benefits": ["Terrible benefit 1", "Insulting benefit 2"]
}
```
3. Save the file and refresh your browser

---

## 🌐 Deployment Options

### GitHub Pages (Free Hosting)
1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Source", select **main** branch
4. Click **Save**
5. Your site will be live at `https://[your-username].github.io/Abandonment-Garden/`

### Other Options
- **Netlify** - Drag and drop the folder
- **Vercel** - Connect your GitHub repo
- **Cloudflare Pages** - Deploy via Git

---

## 🐛 Troubleshooting

### Jobs not loading?
- Make sure you're using a local server (not opening the file directly)
- Check browser console for errors (F12 → Console tab)
- Verify `data/jobs.json` exists and is valid JSON

### Animations not working?
- Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
- Clear browser cache
- Make sure all CSS files are loading (check Network tab in DevTools)

### Login not persisting?
- Check if browser allows localStorage
- Try a different browser
- Disable browser extensions that block storage

---

## 🎨 Design Philosophy

### Visual Experience
- **Advanced CSS** - No basic animations
  - Particle systems and floating elements
  - Morphing blob animations
  - 3D transforms and glassmorphism
  - Custom cursor effects
  - Parallax scrolling
  - Gradient animations
  - Text glitch effects
  - Neon glows and light trails
  - Cinematic page transitions

- **Color Palette**
  - Primary: Deep navy blue (#0a1628)
  - Accent: Rich metallic silver (#b8c5d6)
  - Supporting: Complementary grays and whites

- **Typography**
  - "Abandonment Garden" logo in fancy calligraphic style
  - Animated crying tears effect on the title
  - Professional, corporate fonts for content

- **UI Elements**
  - Custom button shapes (pills, hexagons, blobs, parallelograms)
  - Advanced hover interactions
  - Micro-animations on every element

### Tone
- **Deadpan serious** - The more professional, the funnier
- Corporate language that highlights the absurdity
- No winking at the camera - let the content speak

---

## 🤝 Contributing

This is a satirical parody project. Contributions that enhance the humor, improve animations, or add absurd job listings are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## ⚠️ Disclaimer

**Abandonment Garden is a work of satire and parody.** All job listings, companies, and requirements are fictional and intentionally absurd. This project is meant for entertainment and social commentary on hiring practices. No real companies or individuals are represented.

If a job posting on a real job board looks suspiciously similar to one from Abandonment Garden... well, that's the point. 💀

---

## 📄 License

This project is open source and available for educational and entertainment purposes.

---

## 🌟 Acknowledgments

Created to critique the absurdity of modern job hunting with:
- 🖤 Dark humor
- ✨ Advanced CSS animations
- 💼 Satirical job listings
- 🎭 Deadpan corporate tone

**Built with 🖤 and tears (literally, from the logo)**

---

## 🎯 Project Stats

- **Files:** 25+ HTML, CSS, JS files
- **Lines of Code:** 5,000+ lines of custom code
- **Dependencies:** 0 (pure vanilla everything)
- **Job Listings:** 10 (easily expandable)
- **Rejection Rate:** 100% (by design)

---



**"Where dreams go to die, and requirements go to infinity."**

🌙 Welcome to Abandonment Garden 🌙