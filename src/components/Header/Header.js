import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import './Header.scss';
import { connect } from 'react-redux';

const Header = ({profile}) => (
    <Container>
        <Navbar bg="light" expand="lg">
            <Navbar.Brand href={Object.keys(profile).length > 0 ? '/profile/' + profile.uid : '/'}>
                <Image src="/logo.png"></Image>
            </Navbar.Brand>
            {profile &&
                <div className="profile-overview">
                    {/* {profile.avatar && <img src={Constant.API_URL + profile.avatar} alt="avatar" />} */}
                    {profile.firstName} {profile.lastName}
                </div>
            }
        </Navbar>
    </Container>
)

const mapStateToProps = state => {
    return {profile: state.profile};
}

export default connect(mapStateToProps)(Header);