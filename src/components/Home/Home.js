import Nav_bar from "../Navbar/Navbar"
import './CSS/home.css'
import BackgroundSlider from "./BackgroundSlider"
import About from "./About"
import Features from "./Features"
import FAQ from "./FAQ"
import UpcomingFeatures from "./Upcoming"

const Home = () => {
    return (
        <div className="Home" >
            <div className="Home-content">
            <Nav_bar />
            <BackgroundSlider/>
            <About/>
            <Features/>
            <FAQ/>
            <UpcomingFeatures/>
            </div>
        </div>
    )
}
export default Home