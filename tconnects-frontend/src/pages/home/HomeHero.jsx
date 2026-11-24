import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Search } from "lucide-react";
import HeroStage from "./HeroStage";
import { SERVICES } from "./services";
import "./HomeHero.css";

function dashboardFor(user) {
  return user.role === "candidate" ? "/candidate-dashboard" : "/recruiter-dashboard";
}

export default function HomeHero({ currentUser }) {
  const navigate = useNavigate();
  const activeService = useRef(-1);

  const handleSearch = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const params = new URLSearchParams();
    const search = form.get("search").trim();
    const location = form.get("location").trim();
    if (search) params.set("search", search);
    if (location) params.set("location", location);
    const query = params.toString();
    navigate(query ? `/jobs?${query}` : "/jobs");
  };

  const highlight = (index) => () => {
    activeService.current = index;
  };

  return (
    <section className="vc-hero" aria-labelledby="vc-hero-title">
      <div className="vc-hero__inner">
        <h1 id="vc-hero-title" className="vc-hero__title">
          <span className="vc-hl">Risk management</span> careers,
          <br />
          all in <span className="vc-hl">one place</span>
        </h1>

        <div className="vc-hero__body">
          <p className="vc-hero__sub vc-rise">
            VConnects is the all-in-one platform for risk professionals: jobs, internships,
            freelance work, mentorship, resume making, courses and mock interviews.
          </p>

          <div className="vc-hero__actions vc-rise">
            <Link to="/jobs" className="vc-btn vc-btn--primary">
              Find Jobs
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            {currentUser ? (
              <Link to={dashboardFor(currentUser)} className="vc-btn vc-btn--secondary">
                My Dashboard
              </Link>
            ) : (
              <Link to="/register" className="vc-btn vc-btn--secondary">
                Get Started
              </Link>
            )}
          </div>

          <form className="vc-search vc-rise" action="/jobs" method="get" role="search" onSubmit={handleSearch}>
            <label className="vc-search__field vc-search__field--main">
              <span className="vc-visually-hidden">Job title or keyword</span>
              <input type="text" name="search" placeholder="Job title or keyword" autoComplete="off" />
            </label>
            <label className="vc-search__field">
              <span className="vc-visually-hidden">City</span>
              <input type="text" name="location" placeholder="City" autoComplete="off" />
            </label>
            <button type="submit" className="vc-search__submit">
              <Search size={18} aria-hidden="true" />
              <span className="vc-search__submit-label">Search</span>
              <span className="vc-visually-hidden vc-search__submit-sr">Search jobs</span>
            </button>
          </form>
        </div>

        <HeroStage activeRef={activeService} />

        <nav className="vc-services vc-rise" aria-label="VConnects services">
          <ul>
            {SERVICES.map((service, index) => {
              const ServiceIcon = service.Icon;
              return (
                <li key={service.to}>
                  <Link
                    to={service.to}
                    className="vc-service"
                    onMouseEnter={highlight(index)}
                    onMouseLeave={highlight(-1)}
                    onFocus={highlight(index)}
                    onBlur={highlight(-1)}
                  >
                    <ServiceIcon size={18} aria-hidden="true" />
                    {service.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </section>
  );
}
