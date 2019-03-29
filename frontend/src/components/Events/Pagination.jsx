import React, {Component} from 'react';


export default class Paginate extends Component {
    constructor(props){
        super(props);
        this.state = {
            active:1
        }
    }

    render(){
    let pages = this.props.pages;
    let current_page = this.props.currentPage;
    return (
        <nav aria-label="Page navigation" className="myeventsPagination">
            <ul className="pagination">{[...Array(pages)].map((e, i) => {
                return <li className={current_page==(i+1) ? "page-item active" : "page-item" }  key={i}><a className="page-link" href={"http://localhost:5998/my-events/" + (i+1)}>{i+1}</a></li>
        })}
            </ul>
        </nav>
    )
    }   
}
