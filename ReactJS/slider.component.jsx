import React from 'react';
import providerService from '@app/services/provider.service.js';
import tostada from '@app/helpers/Tostada'

class ProviderAboutUs extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            display: 'block',
            aboutUs: ''
        }
    }

    componentWillUnmount() {
        this.setState({
            providerTeam: null,
            display: 'block',
            aboutUs: ''
        })
    }

    render() {
        if(!this.props.providerTeam)
            this.setState({display: 'none'})
  
        const teamMembers = this.props.providerTeam && this.props.providerTeam.ourTeam ? this.props.providerTeam.ourTeam.map(member => {
            return (        
                <li className="col-md-4" key={member.photo}>
                    <div className="testimonial" >
                        <figure className="pull-left">
                            <img className="rounded" src={member.photo} alt="team members" />
                        </figure>
                        <div className="testimonial-content">
                            <p>{member.description}</p>
                            <cite>
                                {member.name}
                                <span>{member.position}</span>
                            </cite>
                        </div>
                    </div>
                </li>
            )
        }) : <div></div>

        return (
            <div style={{ display: this.state.display}}>
            <div className="heading-title heading-border-bottom heading-color" >
                <h3 className="block">ABOUT US</h3>
                <h5 className="block">WE DO THE BEST WE CAN FOR OUR CUSTOMERS</h5>
            </div>
             <p>{ this.props.providerTeam.aboutUs}</p>
            <ul className="row clearfix testimonial-dotted list-unstyled">
                { teamMembers }
            </ul>
            </div>
        );
    }
}

export default ProviderAboutUs