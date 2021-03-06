import React from 'react'
function Header(props) {

return(

    <nav style={{margin: '0 auto', width: '100%', justifyContent: 'center'}}className="navbar navbar-light bg-light navbar-expand-sm">
        <form className="form-inline">
            <button className="btn btn-outline-success m-1" type="button">Main button</button>
            <button className="btn btn-outline-secondary" type="button">Smaller button</button>
        </form>
    </nav>

    )
}
    export default Header