import * as React from 'react';
import styled, { css } from 'styled-components'
interface Props {
    style?: any,
    disabled?: boolean,
    id?: string,
    className?: string,
    onChange: (e: any) => void,
    dataOptions: DropdownInterface[]
}
export  interface DropdownInterface {
    value: string,
    option: string
}

const SelectStyle = styled.select`
        font-size: 15px;
        font-weight: bold;
        background: ${({ theme }) => theme.bodyAltLighter};
        border: 2px solid rgba(255,255,255,0.05);
        padding:${({ theme }) => theme.padding};
        margin-bottom: 10px ;
        color: ${({ theme }) => theme.focusColor};
        cursor: pointer;
        :hover {
            color: ${({ theme }) => theme.focusColor};
            font-weight: bold;
            font-size: 16px;
        }
`;
// tslint:disable-next-line:no-empty-interface
interface State {}

export class Dropdown extends React.Component<Props, State> {
    render() {
        return (
            <SelectStyle disabled={this.props.disabled} style={this.props.style} className={this.props.className} id={this.props.id} onChange={(e) =>{
                this.props.onChange(e.target.value);
            }}>
                {(this.props.dataOptions).map((data, key) =>{
                    return(
                        <option key={data.value} value={data.value}>{data.option}</option>
                    );
                })}
            </SelectStyle>
        )
    }

}

