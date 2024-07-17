import React from 'react'
import { useFormContext } from 'react-hook-form'

export default function Input({containerClass, inputClass, label, name, type, id, placeholder, required, validation, readOnly}) {

    const {register, formState: { errors }, handleSubmit} = useFormContext()


  return (
    <div className={`${containerClass} input_container`}>

        <label htmlFor={id}>

            <span className="input_text">{label}</span>
            <span className="input_error">
                {errors && errors[name] && errors[name].message}
            </span>

        </label>

        {type === "textarea" ? (
            <textarea 
                className={`input ${inputClass}`}
                {...register(
                    name,
                    {
                        required: {
                            value: required,
                            message: "Required"
                        },
                        validate: validation
                    }
                )}
                id={id}
                placeholder={placeholder}
            />
        ) : (
            <input 
                type={type} 
                {...register(
                    name, 
                    {
                        required: {
                            value: required,
                            message: "Required"
                        },
                        validate: validation
                    }
                )} 
                className={`input ${inputClass} ${readOnly && 'grayed'}`}
                readOnly={readOnly}
                id={id}
                placeholder={placeholder}
            />
        )}
        {type === "select" && (
            <select 
                id={id}
                {...register(
                    name,
                    {
                        required: {
                            value: required,
                            message: "Required"
                        },
                        validate: validation
                    }
                )}
                className={`input ${inputClass}`}
            >
                <option value="" selected disabled>{placeholder}</option>


            </select>
        )}

    </div>
  )
}
