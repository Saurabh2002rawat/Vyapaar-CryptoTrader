import React, { useRef } from 'react'
import emailjs from '@emailjs/browser'
import './Contact.css' ;

const Contact = () => {
   const formRef = useRef () ;
   const sendEmail = (e) => {
      e.preventDefault () ;

      emailjs.sendForm( 
         import.meta.env.VITE_EMAILJS_SERVICE_ID,
         import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
         formRef.current, 
         import.meta.env.VITE_EMAILJS_USER_ID
      ).then( () => {
            alert ( "Thanks for the Mail! Will Contact you soon " ) ;
            formRef.current.reset () ;
      },(error) => {
         alert ( "Failed to send Email : " + error.text ) ;
         }
      );
   };
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
            <form ref={formRef} onSubmit={sendEmail} id="contact-form">
                  <div className="input-box2">
                     <input type="text" className="input" name="Name" required ></input>
                     <label>Name</label>
                  </div>
                  <div className="input-box2">
                     <input type="email" className="input" name="Email" required ></input>
                     <label>Email</label>
                  </div>
                  <div className="input-box2">
                     <input type="text" className="input" name="Subject" required ></input>
                     <label>Subject</label>
                  </div>
                  <div className="input-box2">
                     <textarea className="input" name="Message" id="msg" cols="30" rows="10" required ></textarea>
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
