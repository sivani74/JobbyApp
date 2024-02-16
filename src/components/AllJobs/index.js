import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {AiOutlineSearch} from 'react-icons/ai'

import Header from '../Header'
import JobItem from '../JobItem'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  succes: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
}

const apiJobsStatusConstants = {
  initial: 'INITIAL',
  succes: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
}

const failureViewImage =
  'https://assets.ccbp.in/frontend/react-js/failure-img.png'

class AllJobs extends Component {
  state = {
    profileData: [],
    jobsData: [],
    checkBoxInputs: [],
    radioInput: '',
    searchInput: '',
    apiStatus: apiStatusConstants.initial,
    apiJobStatus: apiJobsStatusConstants.initial,
  }

  componentDidMount() {
    this.onGetProfileDetails()
    this.onGetJobDetails()
  }

  onGetProfileDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const profileApiUrl = 'https://apis.ccbp.in/profile'
    const optionsProfile = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const responseProfile = await fetch(profileApiUrl, optionsProfile)

    if (responseProfile.ok === true) {
      const fetchedDataProfile = [await responseProfile.json()]
      const updatedDataProfile = fetchedDataProfile.profile_details.map(
        eachItem => ({
          name: eachItem.name,
          profileImageUrl: eachItem.profile_image_url,
          shortBio: eachItem.short_bio,
        }),
      )
      this.setState({
        profileData: updatedDataProfile,
        responseSuccess: true,
        apiStatus: apiStatusConstants.succes,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onGetJobDetails = async () => {
    this.setState({apiJobStatus: apiJobsStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {checkBoxInputs, radioInput, searchInput} = this.state
    const jobApiUrl = `https://apis.ccbp.in/jobs?employment_type=${checkBoxInputs}&minimum_package=${radioInput}&search=${searchInput}`
    const optionsjobs = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const responseJobs = await fetch(jobApiUrl, optionsjobs)

    if (responseJobs.ok === true) {
      const fetchedDataJobs = [await responseJobs.json()]
      const updatedDataJobs = fetchedDataJobs.jobs.map(eachItem => ({
        companyLogoUrl: eachItem.company_logo_url,
        title: eachItem.title,
        employmentType: eachItem.employment_type,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        packagePerAnnum: eachItem.package_per_annum,
        rating: eachItem.rating,
      }))
      this.setState({
        jobsData: updatedDataJobs,
        apiJobStatus: apiJobsStatusConstants.succes,
      })
    } else {
      this.setState({apiJobStatus: apiJobsStatusConstants.failure})
    }
  }

  onGetRadioOption = event => {
    this.setState({radioInput: event.target.value}, this.onGetJobDetails)
  }

  onGetInputOption = event => {
    const {checkBoxInputs} = this.state
    const inputNoInList = checkBoxInputs.filter(
      eachItem => eachItem === event.target.id,
    )
    if (inputNoInList.length === 0) {
      this.setState(
        prevState => ({
          checkBoxInputs: [...prevState.checkBoxInputs, event.target.id],
        }),
        this.onGetJobDetails,
      )
    } else {
      const filteredData = checkBoxInputs.filter(
        eachItem => eachItem !== event.target.id,
      )
      this.setState({checkBoxInputs: filteredData}, this.onGetJobDetails)
    }
  }

  onGetProfileView = () => {
    const {profileData, responseSuccess} = this.state
    if (responseSuccess) {
      const {name, profileImageUrl, shortBio} = profileData
      return (
        <div className="profile-container">
          <img src={profileImageUrl} alt="profile" className="profile-image" />
          <h1 className="profile-name">{name}</h1>
          <p>{shortBio}</p>
        </div>
      )
    }
    return null
  }

  onRetryProfile = () => {
    this.onGetProfileDetails()
  }

  onGetProfileFailureView = () => (
    <div>
      <button
        type="button"
        className="retry-button"
        onClick={this.onRetryProfile}
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

  onRenderProfileStatus = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.succes:
        return this.onGetProfileView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.onGetProfileFailureView()
      default:
        return null
    }
  }

  onRetryJobs = () => {
    this.onGetJobDetails()
  }

  onGetJobsFailureView = () => (
    <div className="job-details-failure-view">
      <img
        src={failureViewImage}
        alt="failure view"
        className="failure-view-image"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button className="retry-btn" type="button" onClick={this.onRetryJobs}>
        Retry
      </button>
    </div>
  )

  onGetJobsView = () => {
    const {jobsData} = this.state
    const noJobs = jobsData.length === 0

    return noJobs ? (
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
        />
        <h1>No jobs found</h1>
        <p>We could not find any jobs. Try other filters</p>
      </div>
    ) : (
      <ul>
        {jobsData.map(eachItem => (
          <JobItem key={eachItem.id} jobData={eachItem} />
        ))}
      </ul>
    )
  }

  onRenderJobStatus = () => {
    const {apiJobStatus} = this.state

    switch (apiJobStatus) {
      case apiJobsStatusConstants.succes:
        return this.onGetJobsView()
      case apiJobsStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiJobsStatusConstants.failure:
        return this.onGetJobsFailureView()
      default:
        return null
    }
  }

  onGetCheckBoxesView = () => (
    <ul>
      {employmentTypesList.map(eachItem => (
        <li key={eachItem.employmentTypeId}>
          <input
            className="input"
            type="checkbox"
            id={eachItem.employmentTypeId}
            onChange={this.onGetInputOption}
          />
          <label htmlFor={eachItem.employmentTypeId}>{eachItem.label}</label>
        </li>
      ))}
    </ul>
  )

  onGetRadioButtonsView = () => (
    <ul>
      {salaryRangesList.map(eachItem => (
        <li key={eachItem.salaryRangeId}>
          <input
            type="radio"
            id={eachItem.salaryRangeId}
            name="option"
            className="radio"
            onChange={this.onGetRadioOption}
          />
          <label htmlFor={eachItem.salaryRangeId}>{eachItem.label}</label>
        </li>
      ))}
    </ul>
  )

  onGetSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onSubmitSearchInput = () => {
    this.onGetJobDetails()
  }

  onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      this.onGetJobDetails()
    }
  }

  render() {
    const {searchInput} = this.state

    return (
      <>
        <Header />
        <div className="all-jobs-container">
          <div className="side-bar-container">
            {this.onRenderProfileStatus()}
            <hr />
            <h1>Types of employement</h1>
            {this.onGetCheckBoxesView()}
            <hr />
            <h1>Salary Range</h1>
            {this.onGetRadioButtonsView()}
          </div>
          <div className="jobs-container">
            <div>
              <input
                type="search"
                value={searchInput}
                placeholder="search"
                onChange={this.onGetSearchInput}
                onKeyDown={this.onEnterSearchInput}
              />
              <button
                type="button"
                onClick={this.onSubmitSearchInput}
                data-testid="searchButton"
              >
                <AiOutlineSearch />
              </button>
            </div>
            {this.onRenderJobStatus()}
          </div>
        </div>
      </>
    )
  }
}

export default AllJobs
