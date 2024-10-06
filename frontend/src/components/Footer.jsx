import React from 'react'

function Footer() {
  return (
    <div>
      {/* Footer */}
      <footer className="bg-dark text-white py-2">
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-12 text-center">
                   
                    <p className="mt-3"><a href="/" target='_blank' className="text-white text-decoration-none">
                    &copy; {new Date().getFullYear()} Carspare. All rights reserved.
                        </a></p>
                    {/* <p>
                        <a href="/privacy-policy" className="text-white text-decoration-none">
                            Privacy Policy
                        </a> | 
                        <a href="/terms-of-service" className="text-white text-decoration-none ms-2">
                            Terms of Service
                        </a>
                    </p> */}
                </div>
            </div>
        </div>
    </footer>


    </div>
  )
}

export default Footer
