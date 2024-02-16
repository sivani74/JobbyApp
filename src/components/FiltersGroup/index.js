import {BsSearch} from 'react-icons/bs'

import ProfileDetails from '../ProfileDetails'
import './index.css'

const FiltersGroup = props => {
  const onChangeSearchInput = event => {
    const {changeSearchInput} = props
    changeSearchInput(event)
  }

  const onEnterSearchInput = event => {
    const {getJobs} = props
    if (event.key === 'Enter') {
      getJobs()
    }
  }

  const renderSearchInput = () => {
    const {getJobs, searchInput} = props

    return (
      <div className="search-input-container">
        <input
          type="search"
          className="search-input"
          value={searchInput}
          onChange={onChangeSearchInput}
          onKeyDown={onEnterSearchInput}
        />
        <button type="button" onClick={getJobs} id="searchButton">
          <BsSearch />
        </button>
      </div>
    )
  }

  const renderTypeOfEmployement = () => {
    const {employmentTypesList} = props
    return (
      <div className="employement-type-container">
        <h1>Type of Employement</h1>
        <ul>
          {employmentTypesList.map(eachEmployee => {
            const {changeEmployeeList} = props
            const onSelectEmployeeType = event => {
              changeEmployeeList(event.target.value)
            }
            return (
              <li
                key={eachEmployee.employmentTypeId}
                onChange={onSelectEmployeeType}
              >
                <input
                  type="checkbox"
                  id={eachEmployee.employmentTypeId}
                  value={eachEmployee.employmentTypeId}
                />
                <label htmlFor={eachEmployee.employmentTypeId}>
                  {eachEmployee.label}
                </label>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  const renderSalaryRange = () => {
    const {salaryRangesList} = props
    return (
      <div className="salary-range-container">
        <h1>Salary Range</h1>
        <ul>
          {salaryRangesList.map(eachSalary => {
            const {changeSalary} = props
            const onClickSalary = () => {
              changeSalary(eachSalary.salaryRangeId)
            }
            return (
              <li key={eachSalary.salaryRangeId} onClick={onClickSalary}>
                <input
                  type="radio"
                  id={eachSalary.salaryRangeId}
                  name="salary"
                />
                <label htmlFor={eachSalary.salaryRangeId}>
                  {eachSalary.label}
                </label>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  return (
    <div className="filter-group-container">
      {renderSearchInput()}
      <ProfileDetails />
      <hr />
      {renderTypeOfEmployement()}
      <hr />
      {renderSalaryRange()}
    </div>
  )
}

export default FiltersGroup
