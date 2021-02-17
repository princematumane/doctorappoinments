import * as React from 'react';
import {Loading} from "./loading/loading";


// tslint:disable-next-line: no-empty-interface
interface Props {match: { params: { id: string } } }

interface State { landingState?: any, count: number }


export  class ViewIdea extends React.Component<Props, State> {
    constructor(props: any) {
        super(props)
        this.state = { count: 0 }
    }

    componentDidMount() {
        document.title = 'Idea';
        console.log('props' ,this.props)
    }
    render() {
        if (this.state.landingState) {
            return (<div>
                   
                </div>
            )
        };

        return <div><Loading /></div>
    }
}
