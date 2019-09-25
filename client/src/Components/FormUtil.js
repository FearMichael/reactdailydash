import React from "react";


const FormUtil = ({ children, submit }) => {
    console.log(children);
    console.log(submit);

    const handleSubmit = (e) => {
        if (e.which === 13) {
            console.log("submit?")
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