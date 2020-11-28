import React from 'react';


export class Footer extends React.Component {
    constructor(props){
        super(props);
        this.state = {
        }
    }

    componentDidMount(){
    }
    render() {
        return <>
            <footer id="sticky-footer" class="py-4 bg-dark text-white-50 footer-custom">
                <div class="container text-center">
                <small>Qtrack2</small>
                </div>
            </footer>
            </>
    }
}