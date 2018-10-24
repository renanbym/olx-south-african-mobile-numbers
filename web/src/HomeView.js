import React from "react";
import { checkNumbers, checkNumber } from "./numbers.service";

class HomeView extends React.Component {


    constructor() {
        super();
        this.state = {}
    }

    async componentDidMount() {
        this.setState({});
    }

 

    render() {

        return (
            <div >
                Home
            </div>
        );
    }
}

export default HomeView;
