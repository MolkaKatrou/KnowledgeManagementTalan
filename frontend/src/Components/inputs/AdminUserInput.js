import React from 'react'
import classnames from 'classnames'

function AdminUserInput({ name, onChangeHandler, errors, value, label }) {
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
                <option className='backgroundColor dark' disabled selected>Select the role</option>
                <option className='backgroundColor dark' >USER</option>
                <option className='backgroundColor dark'>ADMIN</option>

            </select>
            {
                    errors && (<div id="validationServer03Feedback" className="invalid-feedback">
                        {errors}
                    </div>)
                }
        </div>
    )
}

export default AdminUserInput