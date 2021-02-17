import * as React from 'react';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components'
// tslint:disable-next-line: no-empty-interface
interface Props {
    warning?: boolean;
    success?: boolean;
}

// tslint:disable-next-line: no-empty-interface
interface State { }


// background: ${({ theme }) => theme.body};
interface StyleSuccessDiv {
    warning?: boolean;
}
const SuccessWrap = styled.div<StyleSuccessDiv>`
        color: lime;
        border: 1.5px solid #00da00;
        border-radius: 4px;
        background: rgba(0,255,8,0.25);
        fontSize:15px;
        text-align: center;
        padding: ${({ theme }) => theme.padding};
        margin-top: ${({ theme }) => theme.padding};
        margin-bottom: ${({ theme }) => theme.padding};
        ${props => props.warning && css`
            color: #090909;
            border: 1px solid #ffcf02;
            background: rgba(255,230,106,0.66);
        `};
`;

export class SuccessDisplay extends React.Component<Props, State> {
    state = {}
    static getDerivedStateFromProps(props: Props, state: State) {
        return props;
    }

    render() {
        return (
            <SuccessWrap warning={this.props.warning}>
                {this.props.children}
            </SuccessWrap>
        )
    }

}
