/* new file created for importing of city*/
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";

const cityKeywords = {
  bangalore:
    "Jobs in Bangalore, Careers in Bangalore, Internships in Bangalore, Freshers Jobs Bangalore, Finance Jobs Bangalore, Banking Jobs Bangalore, Risk Management Jobs Bangalore, Compliance Jobs Bangalore, Audit Jobs Bangalore, GRC Jobs Bangalore",

  mumbai:
    "Jobs in Mumbai, Careers in Mumbai, Internships in Mumbai, Freshers Jobs Mumbai, Banking Jobs Mumbai, Finance Jobs Mumbai, Compliance Jobs Mumbai, Risk Analyst Jobs Mumbai, Audit Jobs Mumbai, Investment Banking Jobs Mumbai",

  chennai:
    "Jobs in Chennai, Careers in Chennai, Internships in Chennai, Freshers Jobs Chennai, Audit Jobs Chennai, Finance Jobs Chennai, Compliance Jobs Chennai, Risk Management Jobs Chennai, Banking Jobs Chennai, Job Vacancies Chennai",

  hyderabad:
    "Jobs in Hyderabad, Careers in Hyderabad, Internships in Hyderabad, Freshers Jobs Hyderabad, IT Jobs Hyderabad, Cyber Risk Jobs Hyderabad, Compliance Jobs Hyderabad, Audit Jobs Hyderabad, Finance Jobs Hyderabad, Banking Jobs Hyderabad",

  pune:
    "Jobs in Pune, Careers in Pune, Internships in Pune, Freshers Jobs Pune, Finance Jobs Pune, Banking Jobs Pune, Compliance Jobs Pune, Audit Jobs Pune, Risk Management Jobs Pune, Job Vacancies Pune",

  delhi:
    "Jobs in Delhi, Careers in Delhi, Internships in Delhi, Freshers Jobs Delhi, Compliance Jobs Delhi, Finance Jobs Delhi, Audit Jobs Delhi, Risk Management Jobs Delhi, Job Openings Delhi, Professional Jobs Delhi",

  gurgaon:
    "Jobs in Gurgaon, Careers in Gurgaon, Internships in Gurgaon, Consulting Jobs Gurgaon, Corporate Jobs Gurgaon, Compliance Jobs Gurgaon, Audit Jobs Gurgaon, Risk Management Jobs Gurgaon, Finance Jobs Gurgaon, Banking Jobs Gurgaon",

  noida:
    "Jobs in Noida, Careers in Noida, Internships in Noida, Freshers Jobs Noida, Compliance Jobs Noida, Audit Jobs Noida, Finance Jobs Noida, Risk Analyst Jobs Noida, Banking Jobs Noida, Job Openings Noida",

  kolkata:
    "Jobs in Kolkata, Careers in Kolkata, Internships in Kolkata, Freshers Jobs Kolkata, Audit Jobs Kolkata, Finance Jobs Kolkata, Compliance Jobs Kolkata, Banking Jobs Kolkata, Risk Management Jobs Kolkata, Job Vacancies Kolkata",

  ahmedabad:
    "Jobs in Ahmedabad, Careers in Ahmedabad, Internships in Ahmedabad, Freshers Jobs Ahmedabad, Finance Jobs Ahmedabad, Banking Jobs Ahmedabad, Compliance Jobs Ahmedabad, Audit Jobs Ahmedabad, Risk Analyst Jobs Ahmedabad, Job Openings Ahmedabad",

  kochi:
    "Jobs in Kochi, Careers in Kochi, Internships in Kochi, Freshers Jobs Kochi, Finance Jobs Kochi, Compliance Jobs Kochi, Audit Jobs Kochi, Banking Jobs Kochi, Remote Jobs Kochi, Job Openings Kochi",

  vizag:
    "Jobs in Vizag, Careers in Vizag, Internships in Vizag, Freshers Jobs Vizag, Finance Jobs Vizag, Compliance Jobs Vizag, Audit Jobs Vizag, Banking Jobs Vizag, Risk Management Jobs Vizag, Job Openings Vizag",

  coimbatore:
    "Jobs in Coimbatore, Careers in Coimbatore, Internships in Coimbatore, Freshers Jobs Coimbatore, Finance Jobs Coimbatore, Compliance Jobs Coimbatore, Audit Jobs Coimbatore, Banking Jobs Coimbatore, Risk Management Jobs Coimbatore, Job Openings Coimbatore",

  jaipur:
    "Jobs in Jaipur, Careers in Jaipur, Internships in Jaipur, Freshers Jobs Jaipur, Finance Jobs Jaipur, Compliance Jobs Jaipur, Audit Jobs Jaipur, Banking Jobs Jaipur, Risk Analyst Jobs Jaipur, Job Openings Jaipur",

  lucknow:
    "Jobs in Lucknow, Careers in Lucknow, Internships in Lucknow, Freshers Jobs Lucknow, Banking Jobs Lucknow, Finance Jobs Lucknow, Compliance Jobs Lucknow, Audit Jobs Lucknow, Risk Management Jobs Lucknow, Job Openings Lucknow",

  indore:
    "Jobs in Indore, Careers in Indore, Internships in Indore, Freshers Jobs Indore, Finance Jobs Indore, Compliance Jobs Indore, Audit Jobs Indore, Banking Jobs Indore, Risk Analyst Jobs Indore, Job Openings Indore",

  nagpur:
    "Jobs in Nagpur, Careers in Nagpur, Internships in Nagpur, Freshers Jobs Nagpur, Banking Jobs Nagpur, Finance Jobs Nagpur, Compliance Jobs Nagpur, Audit Jobs Nagpur, Risk Management Jobs Nagpur, Job Openings Nagpur",

  vijayawada:
    "Jobs in Vijayawada, Careers in Vijayawada, Internships in Vijayawada, Freshers Jobs Vijayawada, Banking Jobs Vijayawada, Finance Jobs Vijayawada, Compliance Jobs Vijayawada, Audit Jobs Vijayawada, Risk Analyst Jobs Vijayawada, Job Openings Vijayawada",
};

export default function CityJobs() {
  const { city } = useParams();

  const cityName =
    city.charAt(0).toUpperCase() + city.slice(1);

  return (
    <>
      <Helmet>
        <title>{cityName} Jobs & Internships | VConnects</title>

        <meta
          name="description"
          content={`Find jobs, internships, banking jobs, finance jobs, compliance jobs, audit jobs and risk management jobs in ${cityName}.`}
        />

        <meta
          name="keywords"
          content={cityKeywords[city.toLowerCase()] || ""}
        />

        <link
          rel="canonical"
          href={`https://v-connects.com/jobs/city/${city}`}
        />
      </Helmet>

      <div style={{ padding: "40px" }}>
        <h1>Jobs in {cityName}</h1>

        <p>
          {cityKeywords[city.toLowerCase()]}
        </p>
      </div>
    </>
  );
}
