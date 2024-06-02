"# MovieForYou" 

### MovieSeen Project

MovieSeen is a MERN (MongoDB, Express.js, React.js, Node.js) project aimed at allowing users to browse and store information about movies. Users can view details of movies, add them to their playlist, and manage their favorite movies.

#### Installation

To run the MovieSeen project locally, follow these steps:

1. **Clone the repository:**
git clone https://github.com/abhishek20111/MovieForYou.git


2. **Navigate to the backend directory:**
cd backend


3. **Install backend dependencies:**
npm install


4. **Start the backend server:**
npm start

The backend server will start running on port 8080.

5. **Open a new terminal window/tab and navigate to the frontend directory:**
cd ../frontend


6. **Install frontend dependencies:**
npm run dev

The frontend server will start running on a port specified by Vite (usually 5`73).

#### Usage

Once the servers are running, you can access the MovieSeen application by opening your web browser and navigating to `http://localhost:5173` (or whichever port your frontend server is running on).

#### Features

- View details of movies including title, poster, release year, and IMDb rating.
- Add movies to your playlist.
- Manage your playlist by marking movies as private or public.
- Optimized API calls using debounce and throttling.
- Utilization of useMemo and useCallback for optimizing re-renders.

#### Technologies Used

- **MongoDB**: Database for storing user information and movie data.
- **Express.js**: Backend framework for handling API requests and business logic.
- **React.js**: Frontend library for building user interfaces.
- **Node.js**: JavaScript runtime environment for running server-side code.
- **Vite**: Frontend build tool for faster development.
- **Debounce and Throttling**: Techniques for optimizing API calls.
- **useMemo and useCallback**: Hooks for optimizing re-renders in React.

#### Credits

The MovieSeen project was created by Abhishek.


