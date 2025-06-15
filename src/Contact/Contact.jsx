import React from 'react'
import './Contact.css' ;
const Contact = () => {
  return (
   <div className="bodi">
    <div className="contain">
      <div className="item">
         <div className="contact">
            <div className="first-text">
               Let's get <br /> in Touch 
            </div>
            <div className="personal-info">
               <ul>
                  <li><i className='bx bx-envelope'></i>sr23mcf1r40@student.nitw.ac.in</li>
                  <li><i className="bx bx-phone"></i>+91 9997545874</li>
               </ul>
            </div>
            <div className="social-link">
               <span className="second-text">
                  Or Connect With me</span>
                  <ul className="social-media">
                     <li className="icons"><a href='https://github.com/Saurabh2002rawat'><i className='bx bxl-github'></i></a></li>
                     <li className="icons"><a href='https://www.linkedin.com/in/-rawat-saurabh/'><i className='bx bxl-linkedin'></i></a></li>
                     <li className="icons"><a href='https://www.instagram.com/saurabh2002rawat/'><i className='bx bxl-instagram'></i></a></li>
                     <li className="icons"><a href='https://www.facebook.com/saurabh.rawat.12764874/'><i className='bx bxl-facebook'></i></a></li>
                     <li className="icons"><a href="https://x.com/saurabhRawat2k2"><i className="bx bxl-twitter"></i></a></li>
                  </ul>
            </div>
         </div>
         <div className="submit-form">
            <h4 className="third-text text">Contact Me </h4>
            <form action = "" id="contact-form">
                  <div className="input-box2">
                     <input type="text" className="input" required ></input>
                     <label>Name</label>
                  </div>
                  <div className="input-box2">
                     <input type="email" className="input" required ></input>
                     <label>Email</label>
                  </div>
                  <div className="input-box2">
                     <input type="text" className="input" required ></input>
                     <label>Subject</label>
                  </div>
                  <div className="input-box2">
                     <textarea className="input" id="message" cols="30" rows="10" required ></textarea>
                     <label>Message</label>
                  </div>
                  <button type="submit" className="bttn">Submit </button>
            </form>
         </div>
      </div>
      </div>
    </div>
  )
}

export default Contact
