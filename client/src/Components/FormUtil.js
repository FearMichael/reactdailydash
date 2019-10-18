import React from "react";


const FormUtil = ({ children, submit }) => {

    const handleSubmit = (e) => {
        if (e.which === 13) {
            submit();
        }
    }
    return (
        <form onKeyPress={handleSubmit}>
            {children}
        </form>
    )
};

export default FormUtil;