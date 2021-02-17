import * as React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

// tslint:disable-next-line: no-empty-interface
interface Props { }

// tslint:disable-next-line: no-empty-interface
interface State { }


// background: ${({ theme }) => theme.body};

const ErrorWrap = styled.div`
    color: red;
    border: 1.5px solid red;
    border-radius: 4px;
    fontSize:15px;
    text-align: center;
    background: rgba(255,0,0,0.25);
    padding: ${({ theme }) => theme.padding};
    margin-top: ${({ theme }) => theme.padding};
    margin-bottom: ${({ theme }) => theme.padding};
`;

export class ErrorDisplay extends React.Component<Props, State> {
    state = {}

    static getDerivedStateFromProps(props: Props, state: State) {
        return props;
    }

    render() {
        return (
            <ErrorWrap>
                {this.props.children}
            </ErrorWrap>

        )
    }

}
