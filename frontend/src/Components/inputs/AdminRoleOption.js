import React from 'react'
import classnames from 'classnames'

function AdminRoleOption({ name, onChangeHandler, errors, value, label }) {
    return (
        <div className="mb-2">
            <label for="Email" className="form-label" style={{fontWeight:'bold'}}>
            {label}
            </label>
            <span className="text-danger">*</span>
            <select
                aria-label="Default select example"
                value={value}
                onChange={onChangeHandler}
                name={name}
                className={(classnames("form-control dark", { "is-invalid": errors }))}
            >
                <option className='backgroundColor dark' disabled selected>Select the job</option>
                <option className='backgroundColor dark'  >Fullstack Developer</option>
                <option className='backgroundColor dark'>BI consultant</option>
                <option className='backgroundColor dark' >Devops Developer</option>
                <option className='backgroundColor dark' >IT Business Analyst </option>
                <option className='backgroundColor dark'>Production support engineer</option>
                <option className='backgroundColor dark' >Java Software Engineer</option>

            </select>
            {
                    errors && (<div id="validationServer03Feedback" className="invalid-feedback">
                        {errors}
                    </div>)
                }
        </div>
    )
}

export default AdminRoleOption