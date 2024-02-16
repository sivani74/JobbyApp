import {Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

const Home = () => (
  <>
    <Header />
    <div className="home-container">
      <h1>Find The Job That Fits Your Life</h1>
      <p>Millions of people are searching for jobs</p>
      <Link to="/jobs">
        <button type="button">Find Jobs</button>
      </Link>
    </div>
  </>
)

export default Home
