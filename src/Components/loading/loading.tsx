import * as React from 'react';

interface Props { small?: boolean, error?: boolean }
// tslint:disable-next-line: no-empty-interface
interface State { }

export class Loading extends React.Component<Props, State> {
    state = {}


    render() {
        let iconClass = 'fas fa-circle-notch fa-spin';
        if (this.props.error) {
            iconClass = 'fas fa-exclamation-triangle';
        }

        if (this.props.small) {
            return <div style={{
                margin: '0 auto',
                paddingTop: 20,
                textAlign: 'center',
                fontSize: 25,
                color: '#ccc',
                opacity: 0.25
            }}>
                <i className={iconClass} /></div>
        }

        return (
            <div style={{
                margin: '0 auto',
                paddingTop: 20,
                textAlign: 'center',
                fontSize: 70,
                color: '#ccc',
                opacity: 0.25
            }}>
                <i className={iconClass} /></div>
        )
    }

}
