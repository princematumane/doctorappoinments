import * as React from 'react';

interface Props { rating: number ,  onClick?: (rating: number) =>void}

// tslint:disable-next-line: no-empty-interface
interface State { }

export class Rating extends React.Component<Props, State> {
    state = {
        rating: 4
    }

    static getDerivedStateFromProps(props: Props, state: State) {
        return props;
    }

    render() {

        const stars = []

        for (let a = 0; a < 5; a++) {
            if (a < this.state.rating) {
                stars.push({ on: true })
            } else {
                stars.push({ on: false })
            }
        }

        return (
            <>{stars.map((star, key) => {
                if (star.on) {
                    return <i key={key} onClick={() =>{
                        //this.props.onClick(key+1);
                    }} style={{ color: '#F5B318' }} className='fas fa-star'></i>
                } else {
                    return <i onClick={() =>{
                       // this.props.onClick(key+1);
                    }} key={key} style={{ color: '#686868' }} className='fas fa-star'></i>
                }
            })}</>
        )
    }
}
