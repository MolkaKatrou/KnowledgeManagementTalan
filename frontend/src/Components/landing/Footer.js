import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../images/logo.png'
import '../../assets/About.css';



function Footer() {
  return (
    <div className='footer-container'>
      <section className='social-media'>
        <div className='social-media-wrap'>
          <div className='footer-logo'>
            <Link to='/' className='social-logo'>
              <img style={{ width: "98px" }} src={logo} alt='logo' />
            </Link>
          </div>
          <small className='website-rights'>Talan Consulting Tunisia © 2022</small>
          <div className='social-icons'>
            <a
              className='social-icon-link facebook'
              herf="https://www.facebook.com/TalanTunisia"
              target='_blank'
              aria-label='Facebook'
              style={{cursor:'pointer'}}
            >
              <i className='fab fa-facebook-f' />
            </a>
            <a
             style={{cursor:'pointer'}}
              className='social-icon-link instagram'
              herf="https://www.instagram.com/talan.group/"
              target='_blank'
              aria-label='Instagram'
            >
              <i className='fab fa-instagram' />
            </a>

            <a
              className='social-icon-link twitter'
              href="https://twitter.com/talan_fr"
              target='_blank'
              aria-label='Twitter'
            >
              <i className='fab fa-twitter' />
            </a>
            <a className='social-icon-link twitter'
              href='https://www.linkedin.com/company/talan-tunisie/'
              target='_blank'
              aria-label='LinkedIn'>

              <i className='fab fa-linkedin' />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Footer;