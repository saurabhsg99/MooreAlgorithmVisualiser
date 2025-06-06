# 🗳️ Moore's Voting Algorithm Visualizer

A dynamic and interactive web application that visualizes Moore's Voting Algorithm step-by-step, helping you understand how this efficient algorithm finds the majority element in an array. Watch the candidate and count change in real-time, and celebrate with digital sprinkles when a majority element is found!

## 🚀 Live Demo

You can check it out here 👉 [https://moores-algorithm-visualizer.netlify.app](https://moores-algorithm-visualizer.netlify.app/)

## ✨ Features

* **Interactive Visualization:** See the array elements, current candidate, and count update in real-time as the algorithm progresses.

* **Step-by-Step Control:** Advance the algorithm manually with the "Next Step" button.

* **Automatic Play:** Let the algorithm run on its own with adjustable speed using the "Run Automatically" feature.

* **Clear Phases:** Clearly displays "Candidate Selection" and "Verification" phases.

* **Dynamic Scrolling:** Automatically scrolls to the visualization area when the algorithm starts, ensuring all relevant information (array, candidate, count) is visible.

* **Celebration Effect:** Experience a delightful "sprinkle" animation when a majority element is successfully identified!

* **Input Flexibility:** Test with your own comma-separated lists of numbers or strings.

* **Example Datasets:** Quickly load pre-defined examples to see the algorithm in action.

* **Responsive Design:** Optimized for seamless viewing and interaction across various devices (desktop, tablet, mobile).

## 💡 How Moore's Voting Algorithm Works

Moore's Voting Algorithm is a clever and efficient technique to find the **majority element** in an array. A majority element is defined as an element that appears **more than** $N/2$ **times** (where $N$ is the total number of elements in the array).

The algorithm operates in two main phases:

1.  **Candidate Selection:** It iterates through the array, maintaining a `candidate` element and a `count`. If the current element matches the candidate, the count is incremented. If it doesn't, the count is decremented. If the count ever drops to zero, a new candidate is chosen. The intuition is that the true majority element will always "outvote" all other elements.

2.  **Verification:** After the first pass, a potential candidate is identified. A second pass is then performed to verify if this candidate's actual occurrences are indeed greater than $N/2$. This step is crucial if the existence of a majority element is not guaranteed.

The beauty of this algorithm lies in its $O(N)$ **time complexity** (linear time) and $O(1)$ **space complexity** (constant extra space), making it highly efficient for large datasets.


## 🛠️ Technologies Used

* **React:** A JavaScript library for building user interfaces.

* **Vite:** A fast build tool for modern web projects (used for project scaffolding and development server).

* **Tailwind CSS:** A utility-first CSS framework for rapidly building custom designs.

## ⚙️ Setup and Local Development

Follow these steps to get a copy of the project up and running on your local machine.

### Prerequisites

Make sure you have Node.js and npm (Node Package Manager) installed:

* [Download Node.js (includes npm)](https://nodejs.org/en/download/)

### Installation Steps

1.  **Clone the repository:**


2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Install Tailwind CSS dependencies and initialize:**

    ```bash
    npm install -D tailwindcss postcss autoprefixer
    # If the above fails, try:
    # .\node_modules\.bin\tailwindcss init -p  (for Windows)
    # ./node_modules/.bin/tailwindcss init -p  (for macOS/Linux)
    ```

    (Ensure `tailwind.config.js` and `postcss.config.js` are created in your root directory after this step.)

4.  **Configure `tailwind.config.js`:**
    Open `tailwind.config.js` and ensure its `content` array includes `"./index.html"` and `"./src/**/*.{js,ts,jsx,tsx}"` to scan your React files for Tailwind classes.

    ```javascript
    // tailwind.config.js
    /** @type {import('tailwindcss').Config} */
    export default {
      content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
      ],
      theme: {
        extend: {},
      },
      plugins: [],
    }
    ```

5.  **Add Tailwind Directives to CSS:**
    Open `src/index.css` (or `src/App.css` depending on your Vite template) and **replace all its existing content** with these lines:

    ```css
    /* src/index.css or src/App.css */
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    ```

6.  **Copy the `App.jsx` code:**
    Replace the entire content of `src/App.jsx` (or `src/App.tsx`) with the code provided in the last immersive response from me.

### Running the Application

After completing the setup:

```bash
npm run dev
```
This will start the development server, and the application will open in your browser, usually at `http://localhost:5173`.
