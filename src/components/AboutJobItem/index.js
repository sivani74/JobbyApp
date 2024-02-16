import {Component} from 'react'
import Cookies from 'js-cookie'
import {MdLocationOn} from 'react-icons/md'
import {AiFillStar} from 'react-icons/ai'
import {BsBriefcaseFill} from 'react-icons/bs'
import {BiLinkExternal} from 'react-icons/bi'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import SimilarJobs from '../SimilarJobs'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  succes: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
}

class AboutJobItem extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    jobDataDetails: [],
    similarJobsData: [],
  }

  componentDidMount() {
    this.getJobsData()
  }

  getJobsData = async props => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')
    const jobDetailsApiUrl = `https://apis.ccbp.in/jobs/${id}`
    const optionsJobData = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const responseJobData = await fetch(jobDetailsApiUrl, optionsJobData)

    if (responseJobData.ok === true) {
      const fetchedJobData = await responseJobData.json()
      const updatedData = [fetchedJobData.job_details].map(eachItem => ({
        companyLogoUrl: eachItem.company_logo_url,
        companyWebsiteUrl: eachItem.company_website_url,
        employmentType: eachItem.employment_type,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        skills: eachItem.skills.map(eachSkill => ({
          imageUrl: eachSkill.image_url,
          name: eachSkill.name,
        })),
        lifeAtCompany: {
          description: eachItem.life_at_company.description,
          imageUrl: eachItem.life_at_company.image_url,
        },
        location: eachItem.location,
        packagePerAnnum: eachItem.package_per_annum,
        rating: eachItem.rating,
      }))
      const updatedSimilarJobDetails = fetchedJobData.similar_jobs.map(
        eachItem => ({
          companyLogoUrl: eachItem.company_logo_url,
          employmentType: eachItem.employment_type,
          id: eachItem.id,
          jobDescription: eachItem.job_description,
          location: eachItem.location,
          rating: eachItem.rating,
          title: eachItem.title,
        }),
      )
      this.setState({
        jobDataDetails: updatedData,
        similarJobsData: updatedSimilarJobDetails,
        apiStatus: apiStatusConstants.succes,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderjobDetailsSuccessView = () => {
    const {jobDataDetails, similarJobsData} = this.state
    if (jobDataDetails.length > 0) {
      const {
        companyLogoUrl,
        companyWebsiteUrl,
        employmentType,
        id,
        jobDescription,
        skills,
        lifeAtCompany,
        location,
        packagePerAnnum,
        rating,
      } = jobDataDetails[0]

      return (
        <>
          <div className="job-item-container">
            <div className="first-part-container">
              <div className="img-title-container">
                <img
                  src={companyLogoUrl}
                  alt="job details company logo"
                  className="company-logo"
                />
                <div className="title-rating-container">
                  <h1 className="title-heading">{similarJobsData.title}</h1>
                  <div className="star-rating-container">
                    <AiFillStar className="star-icon" />
                    <p className="rating-text">{rating}</p>
                  </div>
                </div>
              </div>
              <div className="loaction-package-container">
                <div className="location-job-type-container">
                  <div className="location-icon-location-container">
                    <MdLocationOn className="location-icon" />
                    <p className="location">{location}</p>
                  </div>
                  <div className="location-icon-location-container">
                    <BsBriefcaseFill className="location-icon" />
                    <p className="location">{employmentType}</p>
                  </div>
                </div>
                <div className="package-container">
                  <p className="package">{packagePerAnnum}</p>
                </div>
              </div>
            </div>
            <hr className="item-hr-line" />
            <div className="second-part-container">
              <div className="description-visit-container">
                <h1 className="description-heading">Description</h1>
                <a className="visit-anchor" href={companyWebsiteUrl}>
                  Visit <BiLinkExternal />
                </a>
              </div>
              <p className="description-para">{jobDescription}</p>

              <h1>Skills</h1>
              <ul className="ul-job-details-container">
                {skills.map(eachItem => (
                  <li className="li-job-details-container" key={eachItem.name}>
                    <img
                      src={eachItem.imageUrl}
                      className="skill-img"
                      alt={eachItem.name}
                    />
                    <p>{eachItem.name}</p>
                  </li>
                ))}
              </ul>
              <div className="company-life-image-container">
                <div className="life-container">
                  <h1>Life at Company</h1>
                  <p>{lifeAtCompany.description}</p>
                </div>
                <img src={lifeAtCompany.imageUrl} alt="life at company" />
              </div>
            </div>
            <h1 className="similar-jobs-heading">Similar Jobs</h1>
            <ul className="ul-similar-jobs">
              {similarJobsData.map(eachItem => (
                <SimilarJobs
                  key={eachItem.id}
                  similarJobsData={eachItem}
                  employmentType={employmentType}
                />
              ))}
            </ul>
          </div>
        </>
      )
    }
    return null
  }

  onRetryJobDetailsAgain = () => {
    this.getJobsData()
  }

  renderJobFailureView = () => (
    <div className="job-details-failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-view-image"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button
        className="retry-btn"
        type="button"
        onClick={this.onRetryJobDetailsAgain}
      >
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.succes:
        return this.renderjobDetailsSuccessView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.renderJobFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="job-details-view-container">
          {this.renderJobDetails()}
        </div>
      </>
    )
  }
}

export default AboutJobItem
