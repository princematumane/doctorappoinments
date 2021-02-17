import * as React from 'react';
import styled from 'styled-components';
import { Input } from '../dashboard/input';
import { Doctors } from '../dashboard/interfaces';


// tslint:disable-next-line: no-empty-interface
interface Props {match: { params: { id: string } } }

interface State { doctors:Doctors[] }


let sampleData = [{name:'prince',surname:'matumane',specialiazation:'mmmmmm' , picture:'https://cdn.dribbble.com/users/3821225/screenshots/14390380/media/61d3ef3d841b85a055fc3fa2bb8043d2.png' , age:23 , description:'vvvvvv'}
,{name:'rr',surname:'matumane',specialiazation:'ssss' , picture:'https://cdn.dribbble.com/users/3821225/screenshots/14390380/media/61d3ef3d841b85a055fc3fa2bb8043d2.png' , age:25, description:'vvvvvv'}]

const Maincontainter = styled.div`
    .center{
        position: absolute;
        top: 150px;
        left: 150px;
        width: 80%;
        height: 80%;
        background: ${({ theme }) => theme.bodyAltLighter};
    }
    .searchSection{
        padding:30px;
        background: ${({ theme }) => theme.gradient};
    }
    .filterSection{
        marginLeft:10px;
        display:inline-flex;
        padding:10px;
    }
    .membersListing{
        padding:20px;
        width:100%;
    }


    table {
        border-collapse: collapse;
        width: 100%;
      }
      
      table td, table th {
        border: 1px solid #ddd;
        padding: 8px;
      }
      
      table tr:nth-child(even){background-color: #f2f2f2;}
      
      table tr:hover {background-color: #ddd;}
      
      table th {
        padding-top: 12px;
        padding-bottom: 12px;
        text-align: left;
        background: ${({ theme }) => theme.gradient};
        color: white;
      }
      tbody{
          width:100%;
      }

`;
export  class Home extends React.Component<Props, State> {
    constructor(props: any) {
        super(props)
        this.state = {doctors : sampleData}
    }

    componentDidMount() {
        document.title = 'Home';
        console.log('props' ,this.props)
    }
    render() {
    
            return (
                <Maincontainter>
                    <div className="center">
                        <div className="searchSection">
                            <div className={"filterSection"}>
                                <span>Name</span>
                                <Input/>
                            </div>
                            <div className={"filterSection"}>
                                <span>Proffession</span>
                                <Input/>
                            </div>
                            <div className={"filterSection"}>
                                <span>Hospital</span>
                                <Input/>
                            </div>
                            <div className={"filterSection"}>
                                <span>Date</span>
                                <Input type={"date"}/>
                            </div>
                        </div>
                                <div className={"membersListing"}>
                                    <div style={{display:'inline-flex' ,  width:'100%'}}>
                                        <table>
                                            <thead>
                                                <th></th>
                                                <th>Name</th>
                                                <th>Surname</th>
                                                <th>Specialiazation</th>
                                            </thead>
                                            <tbody>
                                                {(this.state.doctors.map((data,i) =>{
                                                    return <tr key={i+ JSON.stringify(data)}>
                                                                <td> 
                                                                    <img style={{width:50 , height:50}} src={data.picture}/>
                                                                </td>
                                                                <td>{data.name}</td>
                                                                <td>{data.surname}</td>
                                                                <td>{data.specialiazation}</td>
                                                            </tr>
                                                }))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                    </div>
                </Maincontainter>
                
            )
    }
}
