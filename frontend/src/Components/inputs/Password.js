import { style } from "@mui/system";
import classnames from "classnames";
import { useState } from "react";

function Passwordinput({ onChangeHandler,onKeyDown, value, name, placeholder, icon, errors}) {
  const [type, setType] = useState("password");
  const togglePassword = () => {
      if (type === "password") {
          setType("text")
          return;
      }
      setType("password")
  }

  
  return (
        <div className="mb-3">
        <div className="input-group">
          <span style={{ backgroundColor: 'transparent'}}  className="input-group-text dark" >
            <i className={icon}></i>
          </span>
                    <input
                        onKeyDown={onKeyDown}
                        style={{fontFamily:'sans-serif'}}
                        type={type}
                        onChange={onChangeHandler}
                        value={value}
                        name={name}
                        className={(classnames("form-control password-input", {"is-invalid" : errors}))}                        
                        placeholder={placeholder} />
                    
                        <span style={{ backgroundColor: 'transparent'}} className="input-group-text dark" onClick={togglePassword}>
                            {type === "password" ? <i className="fa fa-eye-slash" aria-hidden="true"></i> : <i className="fa fa-eye"></i>}
                        </span>
                   
                    {
        errors && (<div id="validationServer03Feedback" className="invalid-feedback">
        {errors}
      </div> )
    }
                </div>
            </div>
        

    )
}
export default Passwordinput;