const ValdidateMaxLength = (value, formValues) => {
  
    if(value.length > 40){
        return "Max length is 40ch"
    }

}

export default ValdidateMaxLength
