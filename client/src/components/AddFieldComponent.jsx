import React from 'react'
import { IoClose } from 'react-icons/io5'

const AddFieldComponent = ({ close, value, onChange, onSubmit }) => {
    return (
      <section className='fixed top-0 bottom-0 right-0 left-0 bg-neutral-900 bg-opacity-60 z-50 flex justify-center items-center'>
        <div className='bg-white rounded p-4 w-full max-w-md'>
          <div className='flex justify-between items-center gap-3'>
            <h1>Add Field</h1>
            <button onClick={close}>
              <IoClose size={25} />
            </button>
          </div>
  
          <input
            className='bg-blue-50 my-2 p-2 border outline-none focus-within:border-primary-100 rounded w-full'
            placeholder='Enter field name'
            value={value}
            onChange={onChange}
            type="text"
          />
  
          <button
            onClick={onSubmit} // ✅ Corrected here
            className="w-28 px-2 py-2 border border-primary-100 text-primary-100 hover:bg-primary-100 hover:text-black font-semibold rounded text-sm mt-2"
          >
            Add Field
          </button>
        </div>
      </section>
    );
  };
  

export default AddFieldComponent
