import React from 'react'

function Owner({ name }) {
    return (
        <div className="owner">
            made by <span className="fw-400">
                {name}
            </span>
        </div>
    )
}

export default Owner